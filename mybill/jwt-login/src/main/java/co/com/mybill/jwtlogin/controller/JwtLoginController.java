package co.com.mybill.jwtlogin.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class JwtLoginController {

	@RequestMapping("hello")
	public String jwtLogin(@RequestParam(value="name", defaultValue="World") String name) {
		return "Hello " + name + "!!";
	}
}
