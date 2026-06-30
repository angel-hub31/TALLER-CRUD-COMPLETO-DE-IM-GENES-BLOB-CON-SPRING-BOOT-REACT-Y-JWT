package com.krakedev.taller_jwt.services;

import org.mindrot.jbcrypt.BCrypt;
import org.springframework.stereotype.Service;
import com.krakedev.taller_jwt.entidades.Usuario;
import com.krakedev.taller_jwt.repositories.UsuarioRepository;

@Service
public class UsuarioService {

	private final UsuarioRepository usuarioRepository;

	public UsuarioService(UsuarioRepository usuarioRepository) {
		this.usuarioRepository = usuarioRepository;
	}

	public Usuario guardar(Usuario usuario) {
		String contrasenaEncriptada= BCrypt.hashpw(usuario.getPassword(), BCrypt.gensalt() );
		usuario.setPassword(contrasenaEncriptada);
		return usuarioRepository.save(usuario);
	}

	public Usuario autenticar(String username, String password) {
		Usuario usuario = usuarioRepository.findByUsername(username)
				.orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

		if (!BCrypt.checkpw(password, usuario.getPassword())) {
			throw new RuntimeException("Contraseña incorrecta");
		}

		return usuario;
	}
}