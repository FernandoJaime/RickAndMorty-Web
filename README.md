# Rick and Morty Character 

Una aplicación web interactiva que consume la API de Rick and Morty para explorar todos los personajes de la serie.

🌐 

## 🚀 Características

- **Exploración de Personajes**: Visualiza todos los personajes de Rick and Morty con sus imágenes y detalles
- **Filtros Avanzados**: 
  - Búsqueda por nombre
  - Filtro por estado (Alive, Dead, Unknown)
  - Filtro por género (Female, Male, Genderless, Unknown)
- **Paginación**: Navega entre páginas de personajes
- **Detalles**: Haz clic en cualquier personaje para ver información completa

## 🚀 Cómo Usar

1. **Ingresa a** 
2. **Explora** los personajes usando los filtros disponibles
3. **Haz clic** en cualquier personaje para ver más detalles
4. **Si queres podes clonar o descargar** el proyecto y **abrir** `index.html` en tu navegador web

## 🎯 API Endpoints Utilizados

- `GET /api/character` - Lista de personajes
- `GET /api/character?page={page}` - Paginación
- `GET /api/character?name={name}` - Búsqueda por nombre
- `GET /api/character?status={status}` - Filtro por estado
- `GET /api/character?gender={gender}` - Filtro por género