package com.veena.travel.controller;

import com.veena.travel.model.Bus;
import com.veena.travel.repository.BusRepository;
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
@RequestMapping("/api/buses")
public class BusController {
  private final BusRepository busRepository;

  public BusController(BusRepository busRepository) {
    this.busRepository = busRepository;
  }

  @GetMapping
  public List<Bus> getBuses(
      @RequestParam(required = false) String from,
      @RequestParam(required = false) String to,
      @RequestParam(required = false) String busType,
      @RequestParam(required = false) BigDecimal maxPrice,
      @RequestParam(required = false) String sort
  ) {
    var buses = busRepository.findAll().stream();

    if (from != null && !from.isBlank()) {
      buses = buses.filter(bus -> bus.getFrom().toLowerCase().contains(from.toLowerCase()));
    }

    if (to != null && !to.isBlank()) {
      buses = buses.filter(bus -> bus.getTo().toLowerCase().contains(to.toLowerCase()));
    }

    if (busType != null && !busType.isBlank()) {
      buses = buses.filter(bus -> busType.equals(bus.getBusType()));
    }

    if (maxPrice != null) {
      buses = buses.filter(bus -> bus.getPrice().compareTo(maxPrice) <= 0);
    }

    if ("priceAsc".equals(sort)) {
      buses = buses.sorted(Comparator.comparing(Bus::getPrice));
    }

    return buses.toList();
  }

  @GetMapping("/{id}")
  public Bus getBus(@PathVariable Long id) {
    return busRepository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Bus not found."));
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public Bus createBus(@Valid @RequestBody Bus bus) {
    bus.setId(null);
    return busRepository.save(bus);
  }

  @PutMapping("/{id}")
  public Bus updateBus(@PathVariable Long id, @Valid @RequestBody Bus bus) {
    if (!busRepository.existsById(id)) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Bus not found.");
    }
    bus.setId(id);
    return busRepository.save(bus);
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deleteBus(@PathVariable Long id) {
    busRepository.deleteById(id);
  }
}
