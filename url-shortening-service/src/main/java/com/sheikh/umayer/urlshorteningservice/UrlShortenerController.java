package com.sheikh.umayer.urlshorteningservice;

import java.nio.charset.Charset;
import java.time.LocalDateTime;
import java.util.concurrent.TimeUnit;

import javax.validation.constraints.NotNull;

import org.apache.commons.validator.routines.UrlValidator;
import org.hibernate.validator.internal.constraintvalidators.hv.URLValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.google.common.hash.Hashing;

@RestController
@RequestMapping(value = "/url")
public class UrlShortenerController {

	@Autowired
	private RedisTemplate<String, URLInfo> redisTemplate;

	//@Value("${redis.ttl}")
	//private long ttl;

	/**
	 * Returns a short URL.
	 */
	@RequestMapping(method = RequestMethod.POST)
	@ResponseBody
	public ResponseEntity postUrl(@RequestBody @NotNull URLInfo url) {

		// using common's validator to validate the URL. [1]
		UrlValidator validator = new UrlValidator(new String[] { "http", "https" });

		// if invalid url, return error [2]
		if (!validator.isValid(url.getUrl())) {
			Error error = new Error("url " + url.getUrl() + " Invalid URL");
			return ResponseEntity.badRequest().body(error);
		}

		// generating murmur3 based hash key as short URL. [3]
		String slug = Hashing.murmur3_32().hashString(url.getUrl(), Charset.defaultCharset()).toString();
		url.setSlug(slug);
		url.setCreatedAt(LocalDateTime.now());

		// store in redis [4]
		redisTemplate.opsForValue().set(url.getSlug(), url);

		return ResponseEntity.ok(url);
	}

	/**
	 * Returns the original URL.
	 */
	@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity getUrl(@PathVariable String id) {

		// get from redis
		URLInfo url = redisTemplate.opsForValue().get(id);

		if (url == null) {
			Error error = new Error("id" + id + "No such key exists");
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
		}

		return ResponseEntity.ok(url);
	}
}
