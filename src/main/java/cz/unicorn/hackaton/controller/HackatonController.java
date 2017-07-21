package cz.unicorn.hackaton.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.stereotype.Controller;

import cz.unicorn.hackaton.entity.TestEntity;
import cz.unicorn.hackaton.model.*;
import cz.unicorn.hackaton.repository.TestRepository;

@Controller
public class HackatonController {

	@Autowired
	TestRepository repository;


    @MessageMapping("/hello")
    @SendTo("/topic/greetings")
    public Greeting greeting(HelloMessage message) throws Exception {
        Thread.sleep(1000); // simulated delay
        return new Greeting("Hello, " + message.getName() + "!");
    }

	@MessageMapping("/canvas")
	@SendTo("/topic/canvas_test")
	public String canvas(String message) throws Exception {
		TestEntity test = new TestEntity();
		test.setText(message);
		repository.save(test);
		return message;
	}

}
