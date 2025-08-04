import { query } from "../db.js";


const getCanciones = async (_, res) => {

    // Completar con la consulta que devuelve todas las canciones
    // Recordar que los parámetros de una consulta GET se encuentran en req.params
    // Deberían devolver los datos de la siguiente forma:
    /*
        [
            {
                "id": "Id de la canción",
                "nombre": "Nombre de la canción",
                "nombre_artista": "Id del artista",
                "nombre_album": "Id del album",
                "duracion": "Duración de la canción",
                "reproducciones": "Reproducciones de la canción"
            },
            {
                "id": "Id de la canción",
                "nombre": "Nombre de la canción",
                "nombre_artista": "Id del artista",
                "nombre_album": "Id del album",
                "duracion": "Duración de la canción",
                "reproducciones": "Reproducciones de la canción"
            },
            ...
        ]
    */
  
       try {
        const result = await query(`
            SELECT
                canciones.id,
                canciones.nombre,
                artistas.nombre AS nombre_artista,
                albumes.nombre AS nombre_album,
                canciones.duracion,
                canciones.reproducciones
            FROM canciones
            JOIN albumes ON canciones.album = albumes.id
            JOIN artistas ON albumes.artista = artistas.id
        `); 
        res.json(result.rows);
    } catch (error) {
        console.error("Error al obtener las canciones", error);
        res.status(500).json({ error: "Error al obtener las canciones" });
    }
};
const getCancion = async (req, res) => {
    // Completar con la consulta que devuelve una canción
    // Recordar que los parámetros de una consulta GET se encuentran en req.params
    // Deberían devolver los datos de la siguiente forma:
    /*
        {
            "id": "Id de la canción",
            "nombre": "Nombre de la canción",
            "nombre_artista": "Id del artista",
            "nombre_album": "Id del album",
            "duracion": "Duración de la canción",
            "reproducciones": "Reproducciones de la canción"
        }
    */
     // (Reproducciones se inicializa en 0)
  try {
        const result = await query(`
            SELECT
                canciones.id,
                canciones.nombre,
                canciones.duracion,
                canciones.reproducciones,
                artistas.nombre AS nombre_artista,
                albumes.nombre AS nombre_album
            FROM canciones
            JOIN albumes ON canciones.album = albumes.id
            JOIN artistas ON albumes.artista = artistas.id
            WHERE canciones.id = $1`,
            [req.params.id]);
        res.json(result.rows[0]); 
    } catch (error) {
        console.error("Error al obtener la cancion", error);
        res.status(500).json({ error: "Error al obtener la cancion" });
    }
};
const createCancion = async (req, res) => {
    // Completar con la consulta que crea una canción
    // Recordar que los parámetros de una consulta POST se encuentran en req.body
    // Deberían recibir los datos de la siguiente forma:
    /*
        {
            "nombre": "Nombre de la canción",
            "album": "Id del album",
            "duracion": "Duración de la canción",
        }
    */
   
    try {
        const {nombre ,album ,duracion} = req.body;
        await query(`
        INSERT INTO canciones 
            (nombre, album, duracion, reproducciones)
        VALUES ($1, $2, $3, 0)
           `, [nombre, album, duracion]);
        res.status(201).json({ nombre,album,duracion });
    } catch (error) {
        console.error("Error al crear la canción:", error);
        res.status(500).json({ error: "Error al crear la canción"});
    }
};
            
        
const updateCancion = async (req, res) => {
    // Completar con la consulta que actualiza una canción
    // Recordar que los parámetros de una consulta PUT se encuentran en req.body
    // Deberían recibir los datos de la siguiente forma:
    /*
        {
            "nombre": "Nombre de la canción",
            "album": "Id del album",
            "duracion": "Duración de la canción",
        }
    */
    // (Reproducciones no se puede modificar con esta consulta)
  try {
        const { nombre, album, duracion } = req.body;
        await query(`
            UPDATE canciones
            SET nombre = $1, album = $2, duracion = $3
            WHERE id = $4`,
            [nombre, album, duracion, req.params.id]); 
        res.json({ id: req.params.id, nombre, album, duracion }); 
    } catch (error) {
        console.error("Error al actualizar la canción:", error);
        res.status(500).json({ error: "Error al actualizar la canción" });
    }
};
const deleteCancion = async (req, res) => {
    // Completar con la consulta que elimina una canción
    // Recordar que los parámetros de una consulta DELETE se encuentran en req.params
    try {
        // Veamos que la cancion no tenga albumes asociados
        const albumes = await query(`
        SELECT * 
        FROM albumes 
        WHERE cancion = $1`, 
            [req.params.id]);
             if (albumes.rows.length > 0) {
            return res.status(400).json({ error: "La cancion tiene albumes asociados" });
           
        }
         await query(`
        DELETE
        FROM canciones
        WHERE id = $1 `,
           [req.params.id] );
         res.sendStatus(204);
   } catch (error) {
        console.error("Error al eliminar una cancion:", error);
        res.status(500).json({ error: "Error al eliminar una cancion:" });
    }
};
const reproducirCancion = async (req, res) => {
    // Completar con la consulta que aumenta las reproducciones de una canción
    // En este caso es una consulta PUT, pero no recibe ningún parámetro en el body, solo en los params
 try {
     const { id } = req.params;
       await query(`
        UPDATE canciones
        SET reproducciones = reproducciones + 1
        WHERE id =$1`, 
            [id]);
            res.sendStatus(204)
           } catch (error) {
        console.error("Error al actualizar el album:", error);
        res.status(500).json({ error: "Error al el album"});
    }
};


const canciones = {
    getCanciones,
    getCancion,
    createCancion,
    updateCancion,
    deleteCancion,
    reproducirCancion,
};

export default canciones;