package com.krakedev.taller_jwt.controllers;


import java.io.IOException;
import java.util.List;


import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import org.springframework.web.multipart.MultipartFile;


import com.krakedev.taller_jwt.entidades.Celular;
import com.krakedev.taller_jwt.repositories.CelularRepository;



@RestController
@RequestMapping("/auth/celulares")

@CrossOrigin(
    origins = "http://localhost:5173"
)

public class CelularController {



    private final CelularRepository celularRepository;



    public CelularController(
            CelularRepository celularRepository
    ){

        this.celularRepository = celularRepository;

    }






    // ===============================
    // REGISTRAR CELULAR
    // ===============================


    @PostMapping(
        value="/registrar",
        consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<?> registrarCelular(

            @RequestParam("file") MultipartFile file,

            @RequestParam("marca") String marca,

            @RequestParam("modelo") String modelo,

            @RequestParam("detalle") String detalle

    ){


        try {



            // CAMBIO:
            // evitamos error si no llega imagen

            if(file == null || file.isEmpty()){


                return ResponseEntity
                        .badRequest()
                        .body("Debe seleccionar una imagen");


            }





            Celular celular = new Celular();



            celular.setMarca(marca);

            celular.setModelo(modelo);

            celular.setDetalle(detalle);



            celular.setMimeType(
                    file.getContentType()
            );


            celular.setFoto(
                    file.getBytes()
            );



            celularRepository.save(celular);




            return ResponseEntity

                    .status(HttpStatus.CREATED)

                    .body(
                        "Celular registrado correctamente"
                    );



        }
        catch(Exception e){



            return ResponseEntity

                    .status(
                        HttpStatus.INTERNAL_SERVER_ERROR
                    )

                    .body(
                        "Error al guardar celular: "
                        + e.getMessage()
                    );


        }


    }








    // ===============================
    // ACTUALIZAR CELULAR
    // ===============================



    @PutMapping(
        value="/{id}",
        consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )

    public ResponseEntity<?> actualizarCelular(


            @PathVariable Integer id,


            @RequestParam(value="file",required=false)
            MultipartFile file,


            @RequestParam("marca")
            String marca,


            @RequestParam("modelo")
            String modelo,


            @RequestParam("detalle")
            String detalle


    ){



        return celularRepository.findById(id)

        .map(celular -> {



            celular.setMarca(marca);

            celular.setModelo(modelo);

            celular.setDetalle(detalle);




            if(file != null && !file.isEmpty()){


                try {


                    celular.setMimeType(
                            file.getContentType()
                    );


                    celular.setFoto(
                            file.getBytes()
                    );


                }
                catch(IOException e){


                    return ResponseEntity

                    .status(
                        HttpStatus.INTERNAL_SERVER_ERROR
                    )

                    .body(
                        "Error procesando imagen"
                    );


                }


            }




            celularRepository.save(celular);



            return ResponseEntity.ok(
                    "Celular actualizado"
            );



        })

        .orElse(

            ResponseEntity

            .status(HttpStatus.NOT_FOUND)

            .body(
                "Celular no encontrado"
            )

        );


    }









    // ===============================
    // LISTAR CELULARES
    // ===============================



    @GetMapping

    public ResponseEntity<?> listarCelulares(){



        List<Celular> lista =
                celularRepository.findAll();



        // CAMBIO:
        // evitamos mandar la imagen completa
        // en el JSON

        for(Celular c : lista){

            c.setFoto(null);

        }




        return ResponseEntity.ok(lista);


    }









    // ===============================
    // ELIMINAR
    // ===============================



    @DeleteMapping("/{id}")

    public ResponseEntity<?> eliminarCelular(

            @PathVariable Integer id

    ){



        if(!celularRepository.existsById(id)){



            return ResponseEntity

                    .status(HttpStatus.NOT_FOUND)

                    .body(
                        "Celular no existe"
                    );


        }



        celularRepository.deleteById(id);



        return ResponseEntity.ok(
                "Celular eliminado"
        );


    }









    // ===============================
    // OBTENER FOTO
    // ===============================



    @GetMapping("/{id}/foto")

    public ResponseEntity<byte[]> obtenerFoto(

            @PathVariable Integer id

    ){



        Celular celular =

        celularRepository.findById(id)

        .orElseThrow(
            ()->new RuntimeException(
                "Celular no encontrado"
            )
        );




        HttpHeaders headers =
                new HttpHeaders();



        headers.setContentType(
                MediaType.parseMediaType(
                    celular.getMimeType()
                )
        );



        return new ResponseEntity<>(

                celular.getFoto(),

                headers,

                HttpStatus.OK

        );


    }



}