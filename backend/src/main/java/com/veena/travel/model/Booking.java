package com.veena.travel.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;

@Entity
public class Booking {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Enumerated(EnumType.STRING)
  private ProductType productType;

  @Enumerated(EnumType.STRING)
  private BookingStatus status = BookingStatus.CONFIRMED;

  @JsonIgnore
  @ManyToOne(fetch = FetchType.LAZY)
  private User user;

  @ManyToOne(fetch = FetchType.EAGER)
  private Hotel hotel;

  @ManyToOne(fetch = FetchType.EAGER)
  private Flight flight;

  @ManyToOne(fetch = FetchType.EAGER)
  private Bus bus;

  @NotBlank
  private String guestName;

  @Email
  private String email;

  private String checkIn;
  private String checkOut;
  private String departureDate;
  private String returnDate;
  private Integer guests;
  private Integer passengers;
  private String title;
  private String route;
  private String travelDate;
  private BigDecimal price;
  private String paymentStatus = "PENDING";
  private String paymentGateway;
  private String paymentOrderId;
  private String paymentLinkId;
  private String paymentLinkUrl;
  private String paymentQrId;
  private String paymentQrImageUrl;
  private String paymentId;

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public ProductType getProductType() {
    return productType;
  }

  public void setProductType(ProductType productType) {
    this.productType = productType;
  }

  public BookingStatus getStatus() {
    return status;
  }

  public void setStatus(BookingStatus status) {
    this.status = status;
  }

  public User getUser() {
    return user;
  }

  public void setUser(User user) {
    this.user = user;
  }

  public Hotel getHotel() {
    return hotel;
  }

  public void setHotel(Hotel hotel) {
    this.hotel = hotel;
  }

  public Flight getFlight() {
    return flight;
  }

  public void setFlight(Flight flight) {
    this.flight = flight;
  }

  public Bus getBus() {
    return bus;
  }

  public void setBus(Bus bus) {
    this.bus = bus;
  }

  public String getGuestName() {
    return guestName;
  }

  public void setGuestName(String guestName) {
    this.guestName = guestName;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getCheckIn() {
    return checkIn;
  }

  public void setCheckIn(String checkIn) {
    this.checkIn = checkIn;
  }

  public String getCheckOut() {
    return checkOut;
  }

  public void setCheckOut(String checkOut) {
    this.checkOut = checkOut;
  }

  public String getDepartureDate() {
    return departureDate;
  }

  public void setDepartureDate(String departureDate) {
    this.departureDate = departureDate;
  }

  public String getReturnDate() {
    return returnDate;
  }

  public void setReturnDate(String returnDate) {
    this.returnDate = returnDate;
  }

  public Integer getGuests() {
    return guests;
  }

  public void setGuests(Integer guests) {
    this.guests = guests;
  }

  public Integer getPassengers() {
    return passengers;
  }

  public void setPassengers(Integer passengers) {
    this.passengers = passengers;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public String getRoute() {
    return route;
  }

  public void setRoute(String route) {
    this.route = route;
  }

  public String getTravelDate() {
    return travelDate;
  }

  public void setTravelDate(String travelDate) {
    this.travelDate = travelDate;
  }

  public BigDecimal getPrice() {
    return price;
  }

  public void setPrice(BigDecimal price) {
    this.price = price;
  }

  public String getPaymentStatus() {
    return paymentStatus;
  }

  public void setPaymentStatus(String paymentStatus) {
    this.paymentStatus = paymentStatus;
  }

  public String getPaymentGateway() {
    return paymentGateway;
  }

  public void setPaymentGateway(String paymentGateway) {
    this.paymentGateway = paymentGateway;
  }

  public String getPaymentOrderId() {
    return paymentOrderId;
  }

  public void setPaymentOrderId(String paymentOrderId) {
    this.paymentOrderId = paymentOrderId;
  }

  public String getPaymentLinkId() {
    return paymentLinkId;
  }

  public void setPaymentLinkId(String paymentLinkId) {
    this.paymentLinkId = paymentLinkId;
  }

  public String getPaymentLinkUrl() {
    return paymentLinkUrl;
  }

  public void setPaymentLinkUrl(String paymentLinkUrl) {
    this.paymentLinkUrl = paymentLinkUrl;
  }

  public String getPaymentQrId() {
    return paymentQrId;
  }

  public void setPaymentQrId(String paymentQrId) {
    this.paymentQrId = paymentQrId;
  }

  public String getPaymentQrImageUrl() {
    return paymentQrImageUrl;
  }

  public void setPaymentQrImageUrl(String paymentQrImageUrl) {
    this.paymentQrImageUrl = paymentQrImageUrl;
  }

  public String getPaymentId() {
    return paymentId;
  }

  public void setPaymentId(String paymentId) {
    this.paymentId = paymentId;
  }
}
