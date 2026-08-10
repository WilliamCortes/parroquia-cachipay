-- Contenido real extraído de Facebook/Instagram de la parroquia (ver assets/contenido-extraido.md)
-- Las imágenes se siembran aparte (scripts/seed-images.mjs) porque requieren subir archivos a Storage.

insert into contenido (page, section, key, value) values
  ('inicio', 'hero', 'titulo', 'Parroquia Nuestra Señora del Carmen de Cachipay'),
  ('inicio', 'hero', 'subtitulo', 'Diócesis de Girardot · Cachipay, Cundinamarca'),
  ('inicio', 'cta', 'donaciones_texto', 'Con tu diezmo y ofrenda ayudas a sostener la vida y las obras de nuestra parroquia.'),
  ('historia', 'bio', 'texto', 'La Parroquia Nuestra Señora del Carmen de Cachipay pertenece a la Diócesis de Girardot y este año celebra 70 años de vida como comunidad de fe. Sirve al casco urbano de Cachipay y a las veredas de Peña Negra, Tocarema, El Ocaso, Vereda San José y Hacienda Mesitas de Santa Inés, acompañando a sus fieles en la Eucaristía, los sacramentos y las celebraciones marianas, especialmente la fiesta patronal de la Virgen del Carmen cada 16 de julio.'),
  ('historia', 'parroco', 'texto', 'Actualmente la parroquia está bajo el cuidado pastoral del Padre Jonh Fredy Cano.'),
  ('sacramentos', 'intro', 'texto', 'Para información sobre bautizos, primera comunión, confirmación, matrimonio y demás sacramentos, comunícate directamente con la parroquia. Esta sección se ampliará próximamente con los requisitos de cada sacramento.'),
  ('contacto', 'info', 'telefono', '314 312 7939'),
  ('contacto', 'info', 'correo', 'parroquiansccachipay@gmail.com'),
  ('contacto', 'info', 'ubicacion', 'Cachipay, Cundinamarca, Colombia'),
  ('contacto', 'info', 'parroco', 'Padre Jonh Fredy Cano'),
  ('contacto', 'info', 'diocesis', 'Diócesis de Girardot')
on conflict (page, section, key) do nothing;

-- Horario semanal recurrente — PLACEHOLDER, no confirmado por la parroquia.
-- Editar de inmediato desde /admin/horarios en cuanto la parroquia confirme el horario real.
insert into horarios_misa (type, day_of_week, time, location, notes, active, sort_order) values
  ('recurring', 0, '08:00', 'Templo Parroquial', 'Verificar con la parroquia — editar aquí', true, 1)
on conflict do nothing;

-- Fiesta patronal — Virgen del Carmen, 16 de julio
insert into horarios_misa (type, specific_date, time, location, notes, active, sort_order) values
  ('special', '2026-07-16', '07:00', 'Templo Parroquial', 'Fiesta patronal — Virgen del Carmen', true, 10),
  ('special', '2026-07-16', '14:00', 'Templo Parroquial', 'Fiesta patronal — Virgen del Carmen', true, 11),
  ('special', '2026-07-16', '18:00', 'Templo Parroquial', 'Fiesta patronal — Virgen del Carmen', true, 12),
  ('special', '2026-07-18', '11:00', 'Camellón Principal, Vereda El Ocaso', 'Celebración vereda El Ocaso — santa misa y bendición de vehículos', true, 13),
  ('special', '2026-07-18', '11:00', 'Escuela Tocarema', 'Celebración vereda Tocarema — eucaristía y bendición de vehículos', true, 14),
  ('special', '2026-07-19', '07:00', 'Templo Parroquial', 'Gran celebración patronal', true, 15),
  ('special', '2026-07-19', '08:00', 'Capilla El Ocaso', 'Gran celebración patronal', true, 16),
  ('special', '2026-07-19', '10:00', 'Polideportivo Peña Negra', 'Gran celebración patronal', true, 17),
  ('special', '2026-07-19', '10:00', 'Templo Parroquial', 'Gran celebración patronal', true, 18),
  ('special', '2026-07-19', '12:00', 'Templo Parroquial', 'Gran celebración patronal', true, 19),
  ('special', '2026-07-19', '18:00', 'Templo Parroquial', 'Gran celebración patronal', true, 20)
on conflict do nothing;

-- Un aviso real (texto extraído literal de la publicación de Facebook)
insert into eventos_noticias (slug, title, excerpt, body, category, published, published_at) values
  (
    'gracias-por-la-vida-de-nuestro-parroco',
    'Gracias a Dios por la vida de nuestro párroco',
    'Hoy queremos dar gracias a Dios por la vida de nuestro párroco, Jonh Fredy Cano.',
    '<p>Hoy queremos dar gracias a Dios por la vida de nuestro párroco, Jonh Fredy Cano.</p><p>Dios bendiga a todos los sacerdotes, en especial a los sacerdotes de la Diócesis de Girardot.</p>',
    'aviso',
    true,
    now()
  )
on conflict (slug) do nothing;
