package com.krakedev.taller_jwt.controllers;

import java.util.List;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.krakedev.taller_jwt.entidades.Vehiculo;
import com.krakedev.taller_jwt.repositories.VehiculoRepository;

@RestController
@RequestMapping("/auth/vehiculos")
@CrossOrigin(origins = "http://localhost:5173")
public class VehiculoController {
	private final VehiculoRepository vehiculoRepository;

	public VehiculoController(VehiculoRepository vehiculoRepository) {
		super();
		this.vehiculoRepository = vehiculoRepository;
	}

	@PostMapping("/registrar")
	public ResponseEntity<?> registrarVehiculo(@RequestParam("file") MultipartFile file,
			@RequestParam("marca") String marca, @RequestParam("modelo") String modelo) {
		try {
			Vehiculo vehiculo = new Vehiculo();

			vehiculo.setMarca(marca);
			vehiculo.setModelo(modelo);
			vehiculo.setMimeType(file.getContentType());
			vehiculo.setFoto(file.getBytes());

			vehiculoRepository.save(vehiculo);

			return ResponseEntity.status(HttpStatus.CREATED).body("Vehiculo registrado con éxito");

		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Error al procesar archivo: " + e.getMessage());

		}
	}

	@GetMapping
	public ResponseEntity<?> listarVehiculo() {
		List<Vehiculo> lista = vehiculoRepository.findAll();

		for (Vehiculo v : lista) {
			v.setFoto(null);
		}
		return ResponseEntity.ok(lista);
	}

	@GetMapping("/{id}/foto")
	public ResponseEntity<byte[]> obtenerFoto(@PathVariable Integer id) {

		Vehiculo vehiculo = vehiculoRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Vehiculo no encontrado"));

		String mimetype = vehiculo.getMimeType();

		HttpHeaders headers = new HttpHeaders();

		headers.setContentType(MediaType.parseMediaType(mimetype));

		return new ResponseEntity<>(vehiculo.getFoto(), headers, HttpStatus.OK);

	}
}
