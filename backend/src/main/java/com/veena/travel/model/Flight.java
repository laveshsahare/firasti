package com.veena.travel.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;

@Entity
public class Flight {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NotBlank
  private String airline;

  @NotBlank
  private String flightNumber;

  @NotBlank
  private String fromCity;

  @NotBlank
  private String toCity;

  private String departureTime;
  private String arrivalTime;
  private String duration;
  private Integer stops = 0;

  @Positive
  private BigDecimal price;

  private Double rating;
  private String cabinClass;

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getAirline() {
    return airline;
  }

  public void setAirline(String airline) {
    this.airline = airline;
  }

  public String getFlightNumber() {
    return flightNumber;
  }

  public void setFlightNumber(String flightNumber) {
    this.flightNumber = flightNumber;
  }

  public String getFrom() {
    return fromCity;
  }

  public void setFrom(String from) {
    this.fromCity = from;
  }

  public String getTo() {
    return toCity;
  }

  public void setTo(String to) {
    this.toCity = to;
  }

  public String getDepartureTime() {
    return departureTime;
  }

  public void setDepartureTime(String departureTime) {
    this.departureTime = departureTime;
  }

  public String getArrivalTime() {
    return arrivalTime;
  }

  public void setArrivalTime(String arrivalTime) {
    this.arrivalTime = arrivalTime;
  }

  public String getDuration() {
    return duration;
  }

  public void setDuration(String duration) {
    this.duration = duration;
  }

  public Integer getStops() {
    return stops;
  }

  public void setStops(Integer stops) {
    this.stops = stops;
  }

  public BigDecimal getPrice() {
    return price;
  }

  public void setPrice(BigDecimal price) {
    this.price = price;
  }

  public Double getRating() {
    return rating;
  }

  public void setRating(Double rating) {
    this.rating = rating;
  }

  public String getCabinClass() {
    return cabinClass;
  }

  public void setCabinClass(String cabinClass) {
    this.cabinClass = cabinClass;
  }
}
