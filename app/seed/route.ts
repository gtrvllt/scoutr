import bcrypt from 'bcrypt';
import { db } from '@vercel/postgres';

// Données d'exemple pour initialiser `users` et `metas`
const users = [
  {
    id: 'a6b3f10d-1b45-4c6e-bd08-4ea9f9c65cd4',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
  },
  {
    id: '34e8c90d-7a21-4c91-8a6f-34f96de24e78',
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password456',
  },
];

const metas = [
  {
    id: '9f2d72c8-3c1d-4b89-9537-75c5b4cfe908',
    country_code: 'FR',
    type: 'SEO',
    value: 'Meta description for France',
    description: 'SEO meta tag for France.',
  },
  {
    id: 'a6b3f10d-1b45-4c6e-bd08-4ea9f9c65cd4',
    country_code: 'US',
    type: 'Content',
    value: 'Meta description for USA',
    description: 'Content meta tag for USA.',
  },
];

// Connexion à la base de données
const client = await db.connect();

// Fonction pour initialiser `users`
async function seedUsers() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await client.sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `;

  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return client.sql`
        INSERT INTO users (id, name, email, password)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING;
      `;
    })
  );

  console.log('Users seeded:', insertedUsers.length);
}

// Fonction pour initialiser `metas`
async function seedMetas() {
  await client.sql`
    CREATE TABLE IF NOT EXISTS metas (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      country_code VARCHAR(2) NOT NULL,
      type VARCHAR(255) NOT NULL,
      value TEXT NOT NULL,
      description TEXT,
      add_date TIMESTAMP DEFAULT now(),
      edit_date TIMESTAMP
    );
  `;

  const insertedMetas = await Promise.all(
    metas.map((meta) =>
      client.sql`
        INSERT INTO metas (id, country_code, type, value, description, add_date)
        VALUES (${meta.id}, ${meta.country_code}, ${meta.type}, ${meta.value}, ${meta.description}, now())
        ON CONFLICT (id) DO NOTHING;
      `
    )
  );

  console.log('Metas seeded:', insertedMetas.length);
}

// Endpoint GET pour initialiser les tables
export async function GET() {
  try {
    console.log('Seeding database...');
    await client.sql`BEGIN`;

    await seedUsers();
    await seedMetas();

    await client.sql`COMMIT`;
    console.log('Database seeded successfully.');
    return new Response(JSON.stringify({ message: 'Database seeded successfully' }), {
      status: 200,
    });
  } catch (error) {
    await client.sql`ROLLBACK`;
    console.error('Error seeding database:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
