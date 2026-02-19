/**
 * Fuente de datos de los MODELOS 3D de la plataforma.
 * Simula datos provenientes de una base de datos.
 */
const MODELOS = [
  {
    id: "1",
    titulo: "Mando Genérico",
    descripcion: "Modelo 3D genérico ideal para pruebas y personalización.",
    imagen: "/imgs/StreetFigther-Arriba-Ryu.png",
    modelo3D: "/models/mi_pieza_generica.glb",

    // Etiquetas libres (sistema principal de clasificación)
    etiquetas: ["mando", "personalizable", "gaming"],

    // Autor
    creador: {
      username: "JuanMaker",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=JuanMaker"
    },

    // Métricas sociales
    stats: {
      likes: 341,
      descargas: 1205,
      vistas: 5400
    },

    // Capacidades del modelo
    permitePersonalizacion: false,
    permiteImagen: false,

    fechaPublicacion: "2024-10-12"
  },

  {
    id: "2",
    titulo: "Gromash",
    descripcion: "Mando ergonómico de alta precisión con múltiples zonas de color.",
    imagen: "/imgs/grom.png",
    modelo3D: "/models/Gromash.glb",

    etiquetas: ["mando", "ergonomico", "gaming", "custom"],

    creador: {
      username: "OrcDesigner",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=OrcDesigner"
    },

    stats: {
      likes: 892,
      descargas: 3021,
      vistas: 12400
    },

    permitePersonalizacion: true,
    permiteImagen: true,

    fechaPublicacion: "2024-11-02"
  }
];

export { MODELOS };
