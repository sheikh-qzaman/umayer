package com.sheikh.umayer.urlshorteningservice;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UrlShorteningController {
	private Logger logger = LoggerFactory.getLogger(this.getClass());
	
	@Autowired
	private EmployeeRepository repository;

	@GetMapping("/employees")
	List<Employee> all() {
		logger.info("Getting all employees");
		return repository.findAll();
	}

	@PostMapping("/employee")
	Employee newEmployee(@RequestBody Employee newEmployee) {
		//logger.info("NAME: " + newEmployee.name);
		return repository.save(newEmployee);
	}
}
