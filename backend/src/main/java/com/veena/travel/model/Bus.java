package com.veena.travel.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;

@Entity
public class Bus {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NotBlank
  private String operator;

  @NotBlank
  private String busNumber;

  @NotBlank
  private String fromCity;

  @NotBlank
  private String toCity;

  private String departureTime;
  private String arrivalTime;
  private String duration;
  private String busType;
  private Integer seatsAvailable;

  @Positive
  private BigDecimal price;

  private Double rating;

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getOperator() {
    return operator;
  }

  public void setOperator(String operator) {
    this.operator = operator;
  }

  public String getBusNumber() {
    return busNumber;
  }

  public void setBusNumber(String busNumber) {
    this.busNumber = busNumber;
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

  public String getBusType() {
    return busType;
  }

  public void setBusType(String busType) {
    this.busType = busType;
  }

  public Integer getSeatsAvailable() {
    return seatsAvailable;
  }

  public void setSeatsAvailable(Integer seatsAvailable) {
    this.seatsAvailable = seatsAvailable;
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
}
