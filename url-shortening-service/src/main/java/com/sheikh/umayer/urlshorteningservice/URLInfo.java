package com.sheikh.umayer.urlshorteningservice;

import java.time.LocalDateTime;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
class URLInfo {

	//private @Id @GeneratedValue Long id;
	String url;
	@Id String slug;
	LocalDateTime createdAt;

	URLInfo() {
	}

	URLInfo(String url, String slug) {
		this.url = url;
		this.slug = slug;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public String getSlug() {
		return slug;
	}

	public void setSlug(String slug) {
		this.slug = slug;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}
}
