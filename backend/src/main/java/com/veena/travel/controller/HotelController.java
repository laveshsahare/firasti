package com.veena.travel.controller;

import com.veena.travel.model.Hotel;
import com.veena.travel.repository.HotelRepository;
import jakarta.validation.Valid;
import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/hotels")
public class HotelController {
  private final HotelRepository hotelRepository;

  public HotelController(HotelRepository hotelRepository) {
    this.hotelRepository = hotelRepository;
  }

  @GetMapping
  public List<Hotel> getHotels(
      @RequestParam(required = false) String location,
      @RequestParam(required = false) Double minRating,
      @RequestParam(required = false) BigDecimal maxPrice,
      @RequestParam(required = false) String sort
  ) {
    var hotels = hotelRepository.findAll().stream();

    if (location != null && !location.isBlank()) {
      hotels = hotels.filter(hotel -> hotel.getLocation().toLowerCase().contains(location.toLowerCase()));
    }

    if (minRating != null) {
      hotels = hotels.filter(hotel -> hotel.getRating() != null && hotel.getRating() >= minRating);
    }

    if (maxPrice != null) {
      hotels = hotels.filter(hotel -> hotel.getPricePerNight().compareTo(maxPrice) <= 0);
    }

    if ("priceAsc".equals(sort)) {
      hotels = hotels.sorted(Comparator.comparing(Hotel::getPricePerNight));
    }

    return hotels.toList();
  }

  @GetMapping("/{id}")
  public Hotel getHotel(@PathVariable Long id) {
    return hotelRepository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Hotel not found."));
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public Hotel createHotel(@Valid @RequestBody Hotel hotel) {
    hotel.setId(null);
    return hotelRepository.save(hotel);
  }

  @PutMapping("/{id}")
  public Hotel updateHotel(@PathVariable Long id, @Valid @RequestBody Hotel hotel) {
    if (!hotelRepository.existsById(id)) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Hotel not found.");
    }
    hotel.setId(id);
    return hotelRepository.save(hotel);
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deleteHotel(@PathVariable Long id) {
    hotelRepository.deleteById(id);
  }
}
