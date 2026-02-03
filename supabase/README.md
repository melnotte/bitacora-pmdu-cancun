# 📂 Configuración de Base de Datos (Supabase)

Este directorio contiene la estructura y los datos iniciales necesarios para que el proyecto funcione correctamente en un entorno de **Supabase**.

## ⚙ Pasos para la Instalación

Para que el proyecto muestre información (encuestas, documentos, mapas, etc.), sigue este orden estrictamente:

### 1. Preparar el Almacenamiento (Storage)
Antes de cargar los datos, debes crear los contenedores de archivos en tu panel de Supabase para evitar errores de referencia:
1. Ve a la sección **Storage** en tu Dashboard de Supabase.
2. Crea los siguientes 3 Buckets con estos nombres exactos:
   * `geo-data` (Para capas de mapas y GeoJSON).
   * `documents` (Para PDFs y archivos oficiales).
   * `evidences` (Para fotos de denuncias/comentarios).
3. **Configuración de Privacidad:** Asegúrate de marcar los 3 buckets como **Public** para que la aplicación web pueda acceder a los archivos.

### 2. Crear la Estructura (Esquema)
Crea las tablas, funciones, tipos (Enums) y políticas de seguridad:
1. Abre el archivo `migrations/20260203023741_remote_schema.sql`.
2. Copia todo su contenido.
3. Ve al **SQL Editor** en tu panel de Supabase.
4. Pega el código en una nueva consulta y haz clic en **Run**.

### 3. Poblar con Datos (Seed)
Una vez creadas las tablas, llena el sistema con los datos de prueba para que la lógica de la página sea visible:
1. Abre el archivo `seed.sql`.
2. Copia todo su contenido.
3. Ve al **SQL Editor**, pega el código y haz clic en **Run**.

---

## ⚠️ Notas Importantes para Desarrolladores

* **Modo Réplica:** El archivo `seed.sql` comienza con `SET session_replication_role = 'replica';`. Esto es intencional para permitir la carga de datos con relaciones complejas sin errores de integridad temporal.
* **Usuarios:** Los datos de comentarios y perfiles están configurados para ser compatibles con cualquier cuenta nueva. Al registrarte como usuario nuevo, el disparador (`trigger`) te asignará automáticamente el rol `citizen`.
* **Buckets Vacíos:** Aunque el `seed.sql` crea las rutas en la base de datos, los archivos físicos (PDFs, JSONs) deben subirse manualmente a los buckets correspondientes en el Storage para que se visualicen en la web.
* **Sincronización de Tipos:** Si modificas el esquema, actualiza los tipos de TypeScript con:
  ```bash
  npx supabase gen types typescript --project-id TU_PROJECT_ID > src/types/supabase.ts