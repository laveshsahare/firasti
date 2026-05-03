package com.veena.travel.controller;

import com.veena.travel.dto.BookingRequest;
import com.veena.travel.model.Booking;
import com.veena.travel.model.BookingStatus;
import com.veena.travel.model.ProductType;
import com.veena.travel.repository.BookingRepository;
import com.veena.travel.repository.BusRepository;
import com.veena.travel.repository.FlightRepository;
import com.veena.travel.repository.HotelRepository;
import com.veena.travel.repository.UserRepository;
import jakarta.validation.Valid;
import java.math.BigDecimal;
import java.security.Principal;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {
  private final BookingRepository bookingRepository;
  private final UserRepository userRepository;
  private final HotelRepository hotelRepository;
  private final FlightRepository flightRepository;
  private final BusRepository busRepository;

  public BookingController(
      BookingRepository bookingRepository,
      UserRepository userRepository,
      HotelRepository hotelRepository,
      FlightRepository flightRepository,
      BusRepository busRepository
  ) {
    this.bookingRepository = bookingRepository;
    this.userRepository = userRepository;
    this.hotelRepository = hotelRepository;
    this.flightRepository = flightRepository;
    this.busRepository = busRepository;
  }

  @GetMapping("/my")
  public List<Booking> getMyBookings(Principal principal) {
    var user = userRepository.findByEmail(principal.getName())
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found."));
    return bookingRepository.findByUserOrderByIdDesc(user);
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public Booking createBooking(@Valid @RequestBody BookingRequest request, Principal principal) {
    var user = userRepository.findByEmail(principal.getName())
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found."));

    var booking = new Booking();
    booking.setUser(user);
    booking.setStatus(BookingStatus.CONFIRMED);
    booking.setGuestName(request.guestName());
    booking.setEmail(request.email());
    booking.setCheckIn(request.checkIn());
    booking.setCheckOut(request.checkOut());
    booking.setDepartureDate(request.departureDate());
    booking.setReturnDate(request.returnDate());
    booking.setGuests(request.guests());
    booking.setPassengers(request.passengers());
    booking.setTitle(request.title());
    booking.setRoute(request.route());
    booking.setTravelDate(request.travelDate());
    booking.setPrice(request.price());

    attachProduct(booking, request);
    return bookingRepository.save(booking);
  }

  private void attachProduct(Booking booking, BookingRequest request) {
    var productType = request.productType();

    if (productType == ProductType.HOTEL || request.hotelId() != null) {
      var hotel = hotelRepository.findById(requireId(request.hotelId(), "Hotel"))
          .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Hotel not found."));
      booking.setProductType(ProductType.HOTEL);
      booking.setHotel(hotel);
      booking.setTitle(defaultString(booking.getTitle(), hotel.getName()));
      booking.setRoute(defaultString(booking.getRoute(), hotel.getLocation()));
      booking.setTravelDate(defaultString(booking.getTravelDate(), booking.getCheckIn()));
      booking.setPrice(defaultBigDecimal(booking.getPrice(), hotel.getPricePerNight()));
      return;
    }

    if (productType == ProductType.FLIGHT || request.flightId() != null) {
      var flight = flightRepository.findById(requireId(request.flightId(), "Flight"))
          .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Flight not found."));
      booking.setProductType(ProductType.FLIGHT);
      booking.setFlight(flight);
      booking.setTitle(defaultString(booking.getTitle(), flight.getAirline()));
      booking.setRoute(defaultString(booking.getRoute(), flight.getFrom() + " to " + flight.getTo()));
      booking.setTravelDate(defaultString(booking.getTravelDate(), booking.getDepartureDate()));
      booking.setPrice(defaultBigDecimal(booking.getPrice(), flight.getPrice()));
      return;
    }

    if (productType == ProductType.BUS || request.busId() != null) {
      var bus = busRepository.findById(requireId(request.busId(), "Bus"))
          .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Bus not found."));
      booking.setProductType(ProductType.BUS);
      booking.setBus(bus);
      booking.setTitle(defaultString(booking.getTitle(), bus.getOperator()));
      booking.setRoute(defaultString(booking.getRoute(), bus.getFrom() + " to " + bus.getTo()));
      booking.setTravelDate(defaultString(booking.getTravelDate(), booking.getDepartureDate()));
      booking.setPrice(defaultBigDecimal(booking.getPrice(), bus.getPrice()));
      return;
    }

    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Choose a hotel, flight, or bus.");
  }

  private String defaultString(String value, String fallback) {
    return value == null || value.isBlank() ? fallback : value;
  }

  private Long requireId(Long id, String productName) {
    if (id == null) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, productName + " id is required.");
    }
    return id;
  }

  private BigDecimal defaultBigDecimal(BigDecimal value, BigDecimal fallback) {
    return value == null ? fallback : value;
  }
}
