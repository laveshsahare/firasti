package com.veena.travel.controller;

import com.veena.travel.model.Flight;
import com.veena.travel.repository.FlightRepository;
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
@RequestMapping("/api/flights")
public class FlightController {
  private final FlightRepository flightRepository;

  public FlightController(FlightRepository flightRepository) {
    this.flightRepository = flightRepository;
  }

  @GetMapping
  public List<Flight> getFlights(
      @RequestParam(required = false) String from,
      @RequestParam(required = false) String to,
      @RequestParam(required = false) String cabinClass,
      @RequestParam(required = false) BigDecimal maxPrice,
      @RequestParam(required = false) String sort
  ) {
    var flights = flightRepository.findAll().stream();

    if (from != null && !from.isBlank()) {
      flights = flights.filter(flight -> flight.getFrom().toLowerCase().contains(from.toLowerCase()));
    }

    if (to != null && !to.isBlank()) {
      flights = flights.filter(flight -> flight.getTo().toLowerCase().contains(to.toLowerCase()));
    }

    if (cabinClass != null && !cabinClass.isBlank()) {
      flights = flights.filter(flight -> cabinClass.equals(flight.getCabinClass()));
    }

    if (maxPrice != null) {
      flights = flights.filter(flight -> flight.getPrice().compareTo(maxPrice) <= 0);
    }

    if ("priceAsc".equals(sort)) {
      flights = flights.sorted(Comparator.comparing(Flight::getPrice));
    }

    return flights.toList();
  }

  @GetMapping("/{id}")
  public Flight getFlight(@PathVariable Long id) {
    return flightRepository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Flight not found."));
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public Flight createFlight(@Valid @RequestBody Flight flight) {
    flight.setId(null);
    return flightRepository.save(flight);
  }

  @PutMapping("/{id}")
  public Flight updateFlight(@PathVariable Long id, @Valid @RequestBody Flight flight) {
    if (!flightRepository.existsById(id)) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Flight not found.");
    }
    flight.setId(id);
    return flightRepository.save(flight);
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deleteFlight(@PathVariable Long id) {
    flightRepository.deleteById(id);
  }
}
