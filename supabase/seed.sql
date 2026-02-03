SET session_replication_role = 'replica';
--
-- PostgreSQL database dump
--

\restrict R9lDoQCRW9pC9Rri47LkmSu75icjmhB9sItAerDjdtQeZnxq5WUDY60BPDDg2Ca

-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: analytics_events; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.comments (id, user_id, folio, topic, content, zone, email, evidence_url, sentiment, status, internal_note, created_at, has_accepted_privacy) VALUES ('4667ffb6-72b0-48e6-ab56-5abb0b509b32', NULL, 'PMDU-1006', 'Diagnóstico Integrado', 'Lorem ipsum', 'Paseo Nikté', 'melabi.cf@gmail.com', 'https://upoasyoruvlpmeyjwrga.supabase.co/storage/v1/object/public/evidences/public_uploads/1769648675314_063a1z6qf1ua.pdf', NULL, 'pending', NULL, '2026-01-29 01:04:37.589982+00', true);
INSERT INTO public.comments (id, user_id, folio, topic, content, zone, email, evidence_url, sentiment, status, internal_note, created_at, has_accepted_privacy) VALUES ('a0d897b1-b65d-4059-a01b-00b84722d1d5', NULL, 'PMDU-1008', 'Diagnóstico Integrado', 'Propuesta para mejorar la infraestructura vial en la zona centro.', 'Centro', 'ciudadano1@ejemplo.com', NULL, NULL, 'integrated', NULL, '2026-01-04 03:56:22.581886+00', false);
INSERT INTO public.comments (id, user_id, folio, topic, content, zone, email, evidence_url, sentiment, status, internal_note, created_at, has_accepted_privacy) VALUES ('2371f73f-ffbc-4028-b4ec-223178a92487', NULL, 'PMDU-1009', 'Estrategia de Movilidad', 'Se requiere ciclovía en la Av. Tulum.', 'Zona Hotelera', 'ciudadano2@ejemplo.com', NULL, NULL, 'analyzing', NULL, '2026-01-05 03:56:22.581886+00', false);
INSERT INTO public.comments (id, user_id, folio, topic, content, zone, email, evidence_url, sentiment, status, internal_note, created_at, has_accepted_privacy) VALUES ('243c72e1-f701-4eb8-bc29-068cad9277f9', NULL, 'PMDU-1010', 'Zonificación Secundaria', 'Duda sobre el uso de suelo en la Región 95.', 'R95', 'ciudadano3@ejemplo.com', NULL, NULL, 'pending', NULL, '2026-01-11 03:56:22.581886+00', false);
INSERT INTO public.comments (id, user_id, folio, topic, content, zone, email, evidence_url, sentiment, status, internal_note, created_at, has_accepted_privacy) VALUES ('951d04f7-96ce-4589-bb84-0e376c5e1a5c', NULL, 'PMDU-1011', 'Otro', 'Felicitaciones por la plataforma de consulta.', 'SM 20', 'ciudadano4@ejemplo.com', NULL, NULL, 'duplicate', NULL, '2026-01-12 03:56:22.581886+00', false);
INSERT INTO public.comments (id, user_id, folio, topic, content, zone, email, evidence_url, sentiment, status, internal_note, created_at, has_accepted_privacy) VALUES ('9dfb3d11-38d8-4aca-8715-6e768623ae8e', NULL, 'PMDU-1012', 'Diagnóstico Integrado', 'Falta considerar el impacto pluvial en el sur.', 'Sur', 'ciudadano5@ejemplo.com', NULL, NULL, 'integrated', NULL, '2026-01-14 03:56:22.581886+00', false);
INSERT INTO public.comments (id, user_id, folio, topic, content, zone, email, evidence_url, sentiment, status, internal_note, created_at, has_accepted_privacy) VALUES ('b1b729ff-eeff-444a-826f-4ea6f1062279', NULL, 'PMDU-1013', 'Estrategia de Movilidad', 'El transporte público necesita rutas transversales.', 'General', 'ciudadano6@ejemplo.com', NULL, NULL, 'analyzing', NULL, '2026-01-19 03:56:22.581886+00', false);
INSERT INTO public.comments (id, user_id, folio, topic, content, zone, email, evidence_url, sentiment, status, internal_note, created_at, has_accepted_privacy) VALUES ('d8ab83db-b963-4e08-b18f-c08bc3f60b31', NULL, 'PMDU-1014', 'Zonificación Secundaria', 'No estoy de acuerdo con la densidad en esta zona.', 'SM 15', 'ciudadano7@ejemplo.com', NULL, NULL, 'rejected', NULL, '2026-01-20 03:56:22.581886+00', false);
INSERT INTO public.comments (id, user_id, folio, topic, content, zone, email, evidence_url, sentiment, status, internal_note, created_at, has_accepted_privacy) VALUES ('a9922156-268b-4d31-9b46-8872554fb661', NULL, 'PMDU-1015', 'Diagnóstico Integrado', 'Estudio sobre áreas verdes insuficiente.', 'Norte', 'ciudadano8@ejemplo.com', NULL, NULL, 'pending', NULL, '2026-01-21 03:56:22.581886+00', false);
INSERT INTO public.comments (id, user_id, folio, topic, content, zone, email, evidence_url, sentiment, status, internal_note, created_at, has_accepted_privacy) VALUES ('8704680e-5454-4d87-a6d2-5549eec2247c', NULL, 'PMDU-1016', 'Estrategia de Movilidad', 'Optimización de semáforos inteligentes.', 'Centro', 'ciudadano9@ejemplo.com', NULL, NULL, 'pending', NULL, '2026-01-26 03:56:22.581886+00', false);
INSERT INTO public.comments (id, user_id, folio, topic, content, zone, email, evidence_url, sentiment, status, internal_note, created_at, has_accepted_privacy) VALUES ('0609c7df-8769-4394-80b2-6c43e4f928a2', NULL, 'PMDU-1017', 'Otro', 'Consulta sobre fechas de audiencias.', 'SM 30', 'ciudadano10@ejemplo.com', NULL, NULL, 'pending', NULL, '2026-01-28 03:56:22.581886+00', false);
INSERT INTO public.comments (id, user_id, folio, topic, content, zone, email, evidence_url, sentiment, status, internal_note, created_at, has_accepted_privacy) VALUES ('81d78daf-e378-4a73-b754-671b61e2e27f', NULL, 'PMDU-1018', 'Diagnóstico Integrado', 'Sugerencia de protección a manglares.', 'Zona Hotelera', 'ciudadano11@ejemplo.com', NULL, NULL, 'not_applicable', 'Lorem ipsum', '2026-01-29 03:56:22.581886+00', false);
INSERT INTO public.comments (id, user_id, folio, topic, content, zone, email, evidence_url, sentiment, status, internal_note, created_at, has_accepted_privacy) VALUES ('058e5c1a-9e22-4dcc-a80f-90b1fd79ba0e', NULL, 'PMDU-1007', 'Estrategia de Movilidad', 'tincidunt ante augue et felis. Donec vehicula ante non est laoreet pharetra. Maecenas imperdiet, neque sit amet commodo laoreet, nunc enim sollicitudin ex, ac feugiat odio risus ut elit. Nullam sed rutrum urna. Morbi faucibus pretium augue, ut sagittis eros eleifend vitae. Sed condimentum id lectus pellentesque elementum. Pellentesque dictum magna ligula, in aliquam dolor luctus a. Etiam dapibus iaculis fermentum. In faucibus non sem vitae facilisis. Nunc luctus odio at tortor tempus, et viverra orci imperdiet. Sed ornare quam at porta consectetur. Nam luctus enim et nisl volutpat, eget lacinia leo vehicula. Maecenas dapibus efficitur dui non imperdiet. Phasellus ut elit eget sapien facilisis euismod vel ac mauris.

Sed id condimentum diam. Morbi dignissim ligula sed libero porta, in suscipit mi volutpat. Etiam finibus nisl sed volutpat dapibus. Fusce posuere facilisis porttitor. Cras commodo mollis orci, sed suscipit nulla euismod quis. Vivamus pellentesque elit ac hendrerit ultricies. Etiam id urna mattis, efficitur est a, rhoncus neque. Mauris a felis dolor.

Suspendisse luctus justo nec arcu placerat placerat. Suspendisse cursus facilisis turpis vitae fringilla. Nullam in metus in nisi molestie tempus sit amet a elit. Donec quam lorem, lacinia a cursus quis, ullamcorper ac erat. Nullam iaculis risus metus, non finibus neque elementum vitae. Sed nisi dolor, volutpat at nibh eu, aliquet maximus diam. Phasellus et lectus vitae lorem hendrerit blandit in ac mauris. In dui dui, facilisis eu nunc a, fermentum ultrices velit. Donec consectetur lobortis magna et maximus.', 'Zona sur', 'melabi.cf@gmail.com', 'https://upoasyoruvlpmeyjwrga.supabase.co/storage/v1/object/public/evidences/public_uploads/1769658646820_r26rwk9p5u.pdf', NULL, 'pending', 'eeeeeee', '2026-01-29 03:50:47.885136+00', true);


--
-- Data for Name: process_phases; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.process_phases (id, title, description, start_date, end_date, display_dates, status, order_index) VALUES (1, '1. Diagnóstico', 'Identificación de problemáticas.', NULL, NULL, 'Ene - Feb 2024', 'completed', 1);
INSERT INTO public.process_phases (id, title, description, start_date, end_date, display_dates, status, order_index) VALUES (2, '2. Imagen Objetivo', 'Construcción de la visión 2040.', NULL, NULL, 'Marzo 2024', 'completed', 2);
INSERT INTO public.process_phases (id, title, description, start_date, end_date, display_dates, status, order_index) VALUES (3, '3. Estrategias', 'Definición de políticas públicas.', NULL, NULL, 'Abril 2024', 'completed', 3);
INSERT INTO public.process_phases (id, title, description, start_date, end_date, display_dates, status, order_index) VALUES (4, '4. Proyecto', 'Integración del documento técnico.', NULL, NULL, 'Mayo 2024', 'completed', 4);
INSERT INTO public.process_phases (id, title, description, start_date, end_date, display_dates, status, order_index) VALUES (5, '5. Consulta Pública', 'Periodo legal para observaciones.', NULL, NULL, 'Junio 2024', 'active', 5);
INSERT INTO public.process_phases (id, title, description, start_date, end_date, display_dates, status, order_index) VALUES (6, '6. Aprobación y Publicación', 'Dictamen final y publicación.', NULL, NULL, 'Julio 2024', 'upcoming', 6);


--
-- Data for Name: official_instruments; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.official_instruments (id, phase_id, title, status, version, responsible, publish_date, effective_date, official_gazette_url, cabildo_agreement_url, final_document_url, summary_changes, related_links, is_active) VALUES ('ced57f1d-e2d3-4ddd-9e37-81b4c4bdb045', 5, 'Programa Municipal de Desarrollo Urbano (2024-2040)', 'en_aprobacion', 'v2.1 - Borrador Técnico', 'Dirección de Planeación (IMPLAN)', '2024-04-15', '2024-04-16', '''/documentos/ejemplo.pdf''', '''/documentos/ejemplo.pdf''', '/documentos/pmdu-borrador-v2.1.pdf', 'Se actualizaron las tablas de uso de suelo del Polígono Sur.', NULL, true);


--
-- Data for Name: consultation_chapters; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.consultation_chapters (id, instrument_id, name, order_index) VALUES (1, 'ced57f1d-e2d3-4ddd-9e37-81b4c4bdb045', 'Diagnóstico Integrado', 1);
INSERT INTO public.consultation_chapters (id, instrument_id, name, order_index) VALUES (2, 'ced57f1d-e2d3-4ddd-9e37-81b4c4bdb045', 'Estrategia de Movilidad', 2);
INSERT INTO public.consultation_chapters (id, instrument_id, name, order_index) VALUES (3, 'ced57f1d-e2d3-4ddd-9e37-81b4c4bdb045', 'Zonificación Secundaria', 3);
INSERT INTO public.consultation_chapters (id, instrument_id, name, order_index) VALUES (4, 'ced57f1d-e2d3-4ddd-9e37-81b4c4bdb045', 'Otro', 4);


--
-- Data for Name: document_types; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.document_types (id, name, badge_color) VALUES (1, 'Programa', '#2563eb');
INSERT INTO public.document_types (id, name, badge_color) VALUES (2, 'Anexo', '#4b5563');
INSERT INTO public.document_types (id, name, badge_color) VALUES (3, 'Mapa', '#059669');
INSERT INTO public.document_types (id, name, badge_color) VALUES (4, 'Acta', '#d97706');
INSERT INTO public.document_types (id, name, badge_color) VALUES (5, 'Convocatoria', '#7c3aed');
INSERT INTO public.document_types (id, name, badge_color) VALUES (6, 'Dictamen', '#db2777');


--
-- Data for Name: documents; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.documents (id, title, description, phase_id, type_id, version, url, size, tags, publication_date, created_at) VALUES ('83ec135b-ad84-45b7-a2c2-c966c847135e', 'Diagnóstico Integrado del Municipio', 'Documento base', 1, 1, NULL, '/documentos/diagnostico.pdf', NULL, NULL, '2026-01-26', '2026-01-26 07:01:48.542226+00');
INSERT INTO public.documents (id, title, description, phase_id, type_id, version, url, size, tags, publication_date, created_at) VALUES ('5d124343-17e6-47eb-83de-f5cfc22c2265', 'Plano de Infraestructura Hidráulica', 'Mapa de red', 1, 3, NULL, '/documentos/plano-hidraulico.pdf', NULL, NULL, '2026-01-26', '2026-01-26 07:01:48.542226+00');
INSERT INTO public.documents (id, title, description, phase_id, type_id, version, url, size, tags, publication_date, created_at) VALUES ('87815a26-36c2-49bf-9d96-13c6c0e603b9', 'Visión de Ciudad 2040', 'Documento rector', 2, 1, NULL, '/documentos/vision-2040.pdf', NULL, NULL, '2026-01-26', '2026-01-26 07:01:48.542226+00');
INSERT INTO public.documents (id, title, description, phase_id, type_id, version, url, size, tags, publication_date, created_at) VALUES ('bce25d8b-7253-4b7b-9073-f2a6a0869e43', 'Plano de Zonificación Primaria', 'Propuesta visual', 3, 3, NULL, '/documentos/zonificacion-primaria.pdf', NULL, NULL, '2026-01-26', '2026-01-26 07:01:48.542226+00');
INSERT INTO public.documents (id, title, description, phase_id, type_id, version, url, size, tags, publication_date, created_at) VALUES ('11a6973d-44e6-4650-a680-602ec354dc6d', 'Anteproyecto del PMDU', 'Versión técnica', 4, 1, NULL, '/documentos/anteproyecto-v1.pdf', NULL, NULL, '2026-01-26', '2026-01-26 07:01:48.542226+00');
INSERT INTO public.documents (id, title, description, phase_id, type_id, version, url, size, tags, publication_date, created_at) VALUES ('8acc7681-a29c-4474-a4dd-feb0b55eab1f', 'Formato de Observaciones', 'Formulario oficial', 5, 5, NULL, '/documentos/formato-observaciones.pdf', NULL, NULL, '2026-01-26', '2026-01-26 07:01:48.542226+00');


--
-- Data for Name: events; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.events (id, title, date, location, map_query, lat, lng, district, modality, category, status, description, phase_id, agenda, organizers, evidence, created_at, start_time, end_time) VALUES ('408660f3-b058-4de7-97c2-beb7396109d3', 'Taller de Diagnóstico Zona Norte', '2025-10-15', 'Domo Deportivo 237', NULL, 21.202433790565664, -86.8329215275856, 'Zona Norte', 'Presencial', NULL, 'abierto', 'Espacio participativo para identificar problemáticas urbanas específicas de la zona norte de Cancún.', 2, NULL, NULL, '{}', '2026-01-26 07:01:54.239606+00', '10:00:00', '14:00:00');
INSERT INTO public.events (id, title, date, location, map_query, lat, lng, district, modality, category, status, description, phase_id, agenda, organizers, evidence, created_at, start_time, end_time) VALUES ('ab2f516f-a14b-4afd-936d-75ed7817a5dc', 'Foro Virtual: Movilidad Sostenible', '2025-10-20', 'Plataforma Zoom', NULL, NULL, NULL, 'N/A', 'Virtual', NULL, 'lleno', 'Expertos internacionales discuten el futuro de la movilidad en ciudades turísticas.', 3, NULL, NULL, '{}', '2026-01-26 07:01:54.239606+00', '17:00:00', '19:00:00');
INSERT INTO public.events (id, title, date, location, map_query, lat, lng, district, modality, category, status, description, phase_id, agenda, organizers, evidence, created_at, start_time, end_time) VALUES ('bbc84ba3-6ca1-4c2d-8f19-ef95536b6014', 'Instalación del COPLADEMUN', '2024-01-15', 'Salón Presidentes', NULL, 21.1619, -86.8515, 'Centro', 'Presencial', NULL, 'finalizado', 'Sesión solemne de instalación del Comité de Planeación para el Desarrollo Municipal.', 1, NULL, NULL, '{"photosUrl": "https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=1000&auto=format&fit=crop", "reportUrl": {"url": "/documentos/ejemplo.pdf", "uploadedAt": "16 Ene 2024", "uploadedBy": "Secretaría Técnica"}, "attendanceUrl": {"url": "/documentos/ejemplo.pdf", "uploadedAt": "17 Ene 2024"}, "presentationUrl": {"url": "/documentos/ejemplo.pdf", "uploadedAt": "16 Ene 2024", "uploadedBy": "Dir. Planeación"}}', '2026-01-26 07:01:54.239606+00', '12:00:00', NULL);
INSERT INTO public.events (id, title, date, location, map_query, lat, lng, district, modality, category, status, description, phase_id, agenda, organizers, evidence, created_at, start_time, end_time) VALUES ('d9f76e4f-66c5-4d98-87e0-ac0e5f035cc4', 'Mesa de Trabajo: Zona Hotelera', '2025-11-05', 'Cancun Center', NULL, 21.1345, -86.7516, 'Zona Hotelera', 'Presencial', NULL, 'abierto', 'Análisis de infraestructura turística y servicios públicos.', 3, NULL, NULL, '{}', '2026-01-26 07:01:54.239606+00', '09:00:00', NULL);
INSERT INTO public.events (id, title, date, location, map_query, lat, lng, district, modality, category, status, description, phase_id, agenda, organizers, evidence, created_at, start_time, end_time) VALUES ('b0695439-bad8-49c9-90a0-412a04941302', 'Audiencia Pública Consultiva', '2024-06-10', 'Palacio Municipal', NULL, 21.1606, -86.8193, 'Centro', 'Presencial', NULL, 'abierto', 'Presentación del proyecto', 5, NULL, NULL, '{}', '2026-01-26 07:01:54.239606+00', '17:00:00', NULL);
INSERT INTO public.events (id, title, date, location, map_query, lat, lng, district, modality, category, status, description, phase_id, agenda, organizers, evidence, created_at, start_time, end_time) VALUES ('26e8b42b-f03b-4a5d-8aa9-dec6ea114b66', 'Taller de Co-diseño Urbano', '2024-03-15', 'Domo Deportivo SM 95', NULL, 21.1619, -86.8515, 'Región 95', 'Presencial', NULL, 'finalizado', 'Taller participativo', 2, NULL, NULL, '{"photosUrl": "https://pub-tu-proyecto.supabase.co/storage/v1/object/public/images/taller-fotos.jpg", "reportUrl": {"url": "https://pub-tu-proyecto.supabase.co/storage/v1/object/public/documentos/minuta-ejemplo.pdf", "uploadedAt": "2024-03-16"}}', '2026-01-26 07:01:54.239606+00', '10:00:00', '13:00:00');
INSERT INTO public.events (id, title, date, location, map_query, lat, lng, district, modality, category, status, description, phase_id, agenda, organizers, evidence, created_at, start_time, end_time) VALUES ('00ab964a-b414-4cc6-88cd-e49825297758', 'Taller de Futuro 2026', '2026-05-20', 'Ayuntamiento de Cancún', NULL, NULL, NULL, 'Centro', 'Presencial', NULL, 'abierto', 'Taller de prueba para verificar la vista de próximos eventos.', 3, NULL, NULL, '{}', '2026-01-26 07:02:00.300625+00', '10:00:00', NULL);


--
-- Data for Name: event_registrations; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: legal_pages; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: map_categories; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.map_categories (id, title, order_index, is_active) VALUES ('9ebc5f3c-6110-4b4b-b664-3bf8b86420ab', 'Zonificación Primaria', 1, true);
INSERT INTO public.map_categories (id, title, order_index, is_active) VALUES ('fe49974f-a4f8-4eb4-892b-57d5e80feb77', 'Zonificación Secundaria', 2, true);
INSERT INTO public.map_categories (id, title, order_index, is_active) VALUES ('7f75d938-8c8e-4603-ab6a-532c22f1ef31', 'Restricciones', 3, true);
INSERT INTO public.map_categories (id, title, order_index, is_active) VALUES ('0e863132-ed33-4057-9782-11989bfd72c2', 'Estrategia Vial / Movilidad', 4, true);


--
-- Data for Name: map_layers; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.map_layers (id, category_id, name, type, source_url, pdf_url, document_url, color, metadata, is_visible, geometry_type) VALUES ('b6482127-73de-4bf8-9d6a-7fa6195f2ce1', '7f75d938-8c8e-4603-ab6a-532c22f1ef31', 'Índice de Marginación', 'geojson', 'https://upoasyoruvlpmeyjwrga.supabase.co/storage/v1/object/public/geo-data/indice-marginacion.json', 'https://upoasyoruvlpmeyjwrga.supabase.co/storage/v1/object/public/evidences/public_uploads/1769658646820_r26rwk9p5u.pdf', '', '#d73027', '{"paint": {"fill-color": ["match", ["get", "GM_2020"], "Muy alto", "#d73027", "Alto", "#fc8d59", "Medio", "#fee08b", "Bajo", "#d9ef8b", "Muy bajo", "#91cf60", "#ccc"], "fill-opacity": 0.7}, "legend": [{"color": "#d73027", "label": "Muy Alto"}, {"color": "#fee08b", "label": "Medio"}, {"color": "#91cf60", "label": "Muy Bajo"}], "uniqueIdField": "CVE_AGEB", "highlightColor": "#00bcd4"}', true, 'fill');
INSERT INTO public.map_layers (id, category_id, name, type, source_url, pdf_url, document_url, color, metadata, is_visible, geometry_type) VALUES ('cb8c1bcb-fcf0-47e4-98ac-553bb89e7a48', '9ebc5f3c-6110-4b4b-b664-3bf8b86420ab', 'Cambio Poblacional (2010-2020)', 'geojson', 'https://upoasyoruvlpmeyjwrga.supabase.co/storage/v1/object/public/geo-data/cambio-poblacional.json', 'https://upoasyoruvlpmeyjwrga.supabase.co/storage/v1/object/public/evidences/public_uploads/1769658646820_r26rwk9p5u.pdf', 'https://upoasyoruvlpmeyjwrga.supabase.co/storage/v1/object/public/evidences/public_uploads/1769658646820_r26rwk9p5u.pdf', '#6baed6', '{"paint": {"fill-color": ["interpolate", ["linear"], ["get", "p100_dife_pob"], 0, "#f7fbff", 50, "#6baed6", 100, "#08306b"], "fill-opacity": 0.7}, "legend": [{"color": "#d4e2f0", "label": "0% Cambio"}, {"color": "#6baed6", "label": "50% Aumento"}, {"color": "#08306b", "label": "100% Aumento"}], "uniqueIdField": "CVE_AGEB", "visibleFields": ["fid", "CVEGEO"], "highlightColor": "#ffeb3b"}', true, 'fill');


--
-- Data for Name: weekly_polls; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.weekly_polls (id, question, is_active, type, config, open_responses, created_at) VALUES ('b3bea34b-4402-4c27-991b-68d712495301', '¿Cuál es el principal desafío de movilidad?', true, 'multiple_choice', NULL, NULL, '2026-01-26 07:01:43.749159+00');
INSERT INTO public.weekly_polls (id, question, is_active, type, config, open_responses, created_at) VALUES ('c9123456-8e1a-4d3b-9c2f-7cc8ae490c22', '¿Cuántos minutos tardas en tu traslado diario al trabajo?', false, 'numeric', '{"max": 120, "min": 0, "step": 5, "unit": "minutos"}', NULL, '2026-01-26 07:01:43.749159+00');


--
-- Data for Name: poll_options; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.poll_options (id, poll_id, label, votes, is_open_response) VALUES ('3306c4f8-ad55-423a-836f-a2506172c341', 'b3bea34b-4402-4c27-991b-68d712495301', 'Otro (Especifique)', 15, true);
INSERT INTO public.poll_options (id, poll_id, label, votes, is_open_response) VALUES ('f68f4119-c28c-437d-8b22-ee833e87bcbc', 'b3bea34b-4402-4c27-991b-68d712495301', 'Falta de ciclovías', 321, false);
INSERT INTO public.poll_options (id, poll_id, label, votes, is_open_response) VALUES ('3ef63d20-e089-409f-a5de-33b1ae598ad4', 'b3bea34b-4402-4c27-991b-68d712495301', 'Transporte Público lento', 452, false);
INSERT INTO public.poll_options (id, poll_id, label, votes, is_open_response) VALUES ('19412065-6be9-47b6-8bf3-cd68eff751d4', 'b3bea34b-4402-4c27-991b-68d712495301', 'Mal estado de calles', 284, false);


--
-- Data for Name: post_categories; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.post_categories (id, name, color) VALUES (1, 'Comunicado Oficial', 'blue');
INSERT INTO public.post_categories (id, name, color) VALUES (2, 'Participación', 'green');
INSERT INTO public.post_categories (id, name, color) VALUES (3, 'Resultados', 'purple');
INSERT INTO public.post_categories (id, name, color) VALUES (4, 'Aviso', 'red');
INSERT INTO public.post_categories (id, name, color) VALUES (5, 'Avance', 'teal');
INSERT INTO public.post_categories (id, name, color) VALUES (6, 'Hito', 'purple');


--
-- Data for Name: posts; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.posts (id, title, content, excerpt, image_url, published_at, category_id, linked_event_id, linked_document_id) VALUES (1, 'Arranca la fase de Consulta Pública', 'Detalles completos sobre la apertura de la consulta...', 'El H. Ayuntamiento invita a todos los ciudadanos a participar.', 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&q=80', '2026-01-26', 1, NULL, NULL);
INSERT INTO public.posts (id, title, content, excerpt, image_url, published_at, category_id, linked_event_id, linked_document_id) VALUES (2, '¡No faltes al Taller de Diagnóstico!', 'Es importante tu asistencia para definir el futuro de la zona.', 'Revisa la ubicación y fecha del próximo taller presencial.', NULL, '2026-01-24', 2, '408660f3-b058-4de7-97c2-beb7396109d3', NULL);
INSERT INTO public.posts (id, title, content, excerpt, image_url, published_at, category_id, linked_event_id, linked_document_id) VALUES (3, 'Publicación del Diagnóstico Integrado', 'Este documento contiene el análisis técnico detallado.', 'Ya puedes descargar el PDF oficial v2.1.', 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80', '2026-01-21', 3, NULL, '83ec135b-ad84-45b7-a2c2-c966c847135e');
INSERT INTO public.posts (id, title, content, excerpt, image_url, published_at, category_id, linked_event_id, linked_document_id) VALUES (4, 'Avances en la modernización del Centro', 'El equipo de obras públicas reporta un 90% de avance...', 'Se han completado las obras de la primera etapa en la Av. Tulum.', 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&q=80', '2026-01-26', 5, NULL, NULL);
INSERT INTO public.posts (id, title, content, excerpt, image_url, published_at, category_id, linked_event_id, linked_document_id) VALUES (5, 'Aviso de cierre vial por estudios topográficos', 'Debido a los trabajos de levantamiento topográfico para el nuevo PDU...', 'Tome precauciones: Cierre parcial en la Zona Norte este fin de semana.', NULL, '2026-01-24', 4, NULL, NULL);
INSERT INTO public.posts (id, title, content, excerpt, image_url, published_at, category_id, linked_event_id, linked_document_id) VALUES (6, 'Resultados de la encuesta de movilidad', 'Los datos revelan que el 60% de la población prioriza el transporte público...', 'Más de 5,000 ciudadanos participaron en el sondeo digital.', 'https://images.unsplash.com/photo-1570126618953-d437176e8c79?auto=format&fit=crop&q=80', '2026-01-23', 3, NULL, NULL);
INSERT INTO public.posts (id, title, content, excerpt, image_url, published_at, category_id, linked_event_id, linked_document_id) VALUES (7, 'Convocatoria: Únete a las mesas de trabajo vecinales', 'Tu voz es fundamental para el diagnóstico de necesidades barriales...', 'Buscamos representantes de colonias para los foros de distrito.', 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80', '2026-01-21', 2, NULL, NULL);
INSERT INTO public.posts (id, title, content, excerpt, image_url, published_at, category_id, linked_event_id, linked_document_id) VALUES (8, 'Nuevo reglamento de construcción disponible', 'Este documento regulará las densidades y alturas permitidas...', 'Descarga el borrador preliminar para revisión pública.', NULL, '2026-01-20', 1, NULL, NULL);
INSERT INTO public.posts (id, title, content, excerpt, image_url, published_at, category_id, linked_event_id, linked_document_id) VALUES (9, 'Taller de diseño participativo en Bonfil', 'Agradecemos a todos los vecinos que aportaron sus ideas...', 'Gran asistencia en el domo deportivo durante el fin de semana.', 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80', '2026-01-19', 6, NULL, NULL);
INSERT INTO public.posts (id, title, content, excerpt, image_url, published_at, category_id, linked_event_id, linked_document_id) VALUES (10, 'Entrevista con el Director de Planeación', 'En esta entrevista exclusiva se detallan los ejes estratégicos...', 'Conoce la visión a largo plazo para Cancún 2040.', 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80', '2026-01-17', 1, NULL, NULL);
INSERT INTO public.posts (id, title, content, excerpt, image_url, published_at, category_id, linked_event_id, linked_document_id) VALUES (11, 'Mapa de riesgos actualizado', 'Protección Civil ha validado las nuevas capas de información...', 'Identificación de nuevas zonas vulnerables a inundaciones.', NULL, '2026-01-15', 5, NULL, NULL);
INSERT INTO public.posts (id, title, content, excerpt, image_url, published_at, category_id, linked_event_id, linked_document_id) VALUES (12, 'Sesión del Comité Técnico', 'La sesión se llevó a cabo en el Salón Presidentes...', 'Expertos validan la metodología del índice de marginación.', NULL, '2026-01-12', 6, NULL, NULL);
INSERT INTO public.posts (id, title, content, excerpt, image_url, published_at, category_id, linked_event_id, linked_document_id) VALUES (13, 'Recordatorio: Fecha límite para propuestas ciudadanas', 'Recuerda que puedes entregarlas en físico o digital...', 'Quedan 5 días para enviar tus propuestas por escrito.', NULL, '2026-01-09', 4, NULL, NULL);
INSERT INTO public.posts (id, title, content, excerpt, image_url, published_at, category_id, linked_event_id, linked_document_id) VALUES (14, 'Instalación del Consejo Consultivo', 'Autoridades y sociedad civil firmaron el acta de instalación...', 'El evento marca el inicio formal de los trabajos del PDU.', 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80', '2026-01-07', 6, NULL, NULL);
INSERT INTO public.posts (id, title, content, excerpt, image_url, published_at, category_id, linked_event_id, linked_document_id) VALUES (15, 'Diagnóstico preliminar: Infraestructura Hidráulica', 'El informe técnico muestra las zonas con mayor estrés hídrico...', 'Se detectan áreas de oportunidad en la red de agua potable.', 'https://images.unsplash.com/photo-1605218427306-6354db69e563?auto=format&fit=crop&q=80', '2026-01-02', 3, NULL, NULL);


--
-- Name: comments_folio_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.comments_folio_seq', 1018, true);


--
-- Name: consultation_chapters_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.consultation_chapters_id_seq', 4, true);


--
-- Name: document_types_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.document_types_id_seq', 6, true);


--
-- Name: post_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.post_categories_id_seq', 6, true);


--
-- Name: posts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.posts_id_seq', 15, true);


--
-- Name: process_phases_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.process_phases_id_seq', 6, true);


--
-- PostgreSQL database dump complete
--

\unrestrict R9lDoQCRW9pC9Rri47LkmSu75icjmhB9sItAerDjdtQeZnxq5WUDY60BPDDg2Ca
SET session_replication_role = 'origin';
