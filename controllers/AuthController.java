package com.krakedev.taller_jwt.controllers;

import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.krakedev.taller_jwt.JwtUtil;
import com.krakedev.taller_jwt.entidades.Usuario;
import com.krakedev.taller_jwt.services.TokenBlackListService;
import com.krakedev.taller_jwt.services.UsuarioService;

@RestController
@RequestMapping("/auth")
public class AuthController {

	private final UsuarioService usuarioService;
	private final TokenBlackListService blackListService;

	public AuthController(UsuarioService usuarioService,TokenBlackListService blackListService) {
		super();
		this.usuarioService = usuarioService;
		this.blackListService = blackListService;
	}

	@PostMapping("/registrar")
	public ResponseEntity<?> registrar(@RequestBody Usuario usuario) {
		try {
			Usuario usuarioNuevo = usuarioService.guardar(usuario);
			return ResponseEntity.status(HttpStatus.CREATED).body(usuarioNuevo);

		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Error al registrar usuario: " + e.getMessage());
		}
	}

	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody Map<String, String> credenciales) {
		try {
			String username = credenciales.get("username");
			String password = credenciales.get("password");

			Usuario usuario = usuarioService.autenticar(username, password);
			String token = JwtUtil.generarToken(usuario.getUsername(), usuario.getRol());

			return ResponseEntity.ok(Map.of("token", token));

		} catch (RuntimeException e) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Error en el servidor: " + e.getMessage());
		}
	}

	@GetMapping("/perfil")
	public ResponseEntity<?> verPerfil() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		String usuario = auth.getName();
		String rol = auth.getAuthorities().iterator().next().getAuthority();
		return ResponseEntity.ok(Map.of("Mensaje", "Bienvenido al sistema protegido por Spring Security", "Usuario",
				usuario, "rol_detectado", rol, "status", "Autenticado exitosamente"));

	}

	@PostMapping("/logout")
	public ResponseEntity<?> logout(@RequestHeader(value = "Authorization", required = false) String authHeader) {
		if (authHeader != null && authHeader.startsWith("Bearer ")) {
			String token = authHeader.substring(7);

			blackListService.invalidarToken(token);

			return ResponseEntity.ok(Map.of("Mensaje", "Sesion cerrada exitosamente: Token invalidado"));

		} else {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Token no proporcionado ");
		}

	}
	@GetMapping("/dashboard")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?>adminDashboard(){
		String usuario = SecurityContextHolder.getContext().getAuthentication().getName();
		return ResponseEntity.ok(Map.of("Mensaje", "Bienvenido al panel secreto de administradores","admin", usuario));
		
		
	}
	
}