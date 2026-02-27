import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("academia.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS departments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    code TEXT NOT NULL UNIQUE,
    hod_id INTEGER,
    status TEXT CHECK(status IN ('active', 'archived')) DEFAULT 'active',
    description TEXT,
    FOREIGN KEY (hod_id) REFERENCES users(id)
  );
`);

// Migration: Add columns to departments if they don't exist
const tableInfo = db.prepare("PRAGMA table_info(departments)").all();
const columns = tableInfo.map((c: any) => c.name);
if (!columns.includes('code')) {
  try { db.exec("ALTER TABLE departments ADD COLUMN code TEXT UNIQUE"); } catch(e) {}
}
if (!columns.includes('hod_id')) {
  try { db.exec("ALTER TABLE departments ADD COLUMN hod_id INTEGER REFERENCES users(id)"); } catch(e) {}
}
if (!columns.includes('status')) {
  try { db.exec("ALTER TABLE departments ADD COLUMN status TEXT CHECK(status IN ('active', 'archived')) DEFAULT 'active'"); } catch(e) {}
}
if (!columns.includes('description')) {
  try { db.exec("ALTER TABLE departments ADD COLUMN description TEXT"); } catch(e) {}
}

db.exec(`
  CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    department_id INTEGER,
    duration_years INTEGER DEFAULT 4,
    total_semesters INTEGER DEFAULT 8,
    status TEXT CHECK(status IN ('active', 'archived')) DEFAULT 'active',
    description TEXT,
    FOREIGN KEY (department_id) REFERENCES departments(id)
  );
`);

// Migration: Add columns to courses if they don't exist
const courseTableInfo = db.prepare("PRAGMA table_info(courses)").all();
const courseColumns = courseTableInfo.map((c: any) => c.name);
if (!courseColumns.includes('code')) {
  try { db.exec("ALTER TABLE courses ADD COLUMN code TEXT UNIQUE"); } catch(e) {}
}
if (!courseColumns.includes('duration_years')) {
  try { db.exec("ALTER TABLE courses ADD COLUMN duration_years INTEGER DEFAULT 4"); } catch(e) {}
}
if (!courseColumns.includes('total_semesters')) {
  try { db.exec("ALTER TABLE courses ADD COLUMN total_semesters INTEGER DEFAULT 8"); } catch(e) {}
}
if (!courseColumns.includes('status')) {
  try { db.exec("ALTER TABLE courses ADD COLUMN status TEXT CHECK(status IN ('active', 'archived')) DEFAULT 'active'"); } catch(e) {}
}
if (!courseColumns.includes('description')) {
  try { db.exec("ALTER TABLE courses ADD COLUMN description TEXT"); } catch(e) {}
}

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT CHECK(role IN ('admin', 'staff', 'student')) NOT NULL,
    department_id INTEGER,
    course_id INTEGER, -- For students
    FOREIGN KEY (department_id) REFERENCES departments(id),
    FOREIGN KEY (course_id) REFERENCES courses(id)
  );

  CREATE TABLE IF NOT EXISTS subjects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    course_id INTEGER,
    staff_id INTEGER,
    semester INTEGER,
    credits INTEGER DEFAULT 3,
    type TEXT CHECK(type IN ('core', 'elective', 'lab')) DEFAULT 'core',
    status TEXT CHECK(status IN ('active', 'archived')) DEFAULT 'active',
    description TEXT,
    FOREIGN KEY (course_id) REFERENCES courses(id),
    FOREIGN KEY (staff_id) REFERENCES users(id)
  );
`);

// Migration: Add columns to subjects if they don't exist
const subjectTableInfo = db.prepare("PRAGMA table_info(subjects)").all();
const subjectColumns = subjectTableInfo.map((c: any) => c.name);
if (!subjectColumns.includes('code')) {
  try { db.exec("ALTER TABLE subjects ADD COLUMN code TEXT UNIQUE"); } catch(e) {}
}
if (!subjectColumns.includes('semester')) {
  try { db.exec("ALTER TABLE subjects ADD COLUMN semester INTEGER"); } catch(e) {}
}
if (!subjectColumns.includes('credits')) {
  try { db.exec("ALTER TABLE subjects ADD COLUMN credits INTEGER DEFAULT 3"); } catch(e) {}
}
if (!subjectColumns.includes('type')) {
  try { db.exec("ALTER TABLE subjects ADD COLUMN type TEXT CHECK(type IN ('core', 'elective', 'lab')) DEFAULT 'core'"); } catch(e) {}
}
if (!subjectColumns.includes('status')) {
  try { db.exec("ALTER TABLE subjects ADD COLUMN status TEXT CHECK(status IN ('active', 'archived')) DEFAULT 'active'"); } catch(e) {}
}
if (!subjectColumns.includes('description')) {
  try { db.exec("ALTER TABLE subjects ADD COLUMN description TEXT"); } catch(e) {}
}

db.exec(`
  CREATE TABLE IF NOT EXISTS classes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subject_id INTEGER,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    topic TEXT,
    description TEXT,
    FOREIGN KEY (subject_id) REFERENCES subjects(id)
  );

  CREATE TABLE IF NOT EXISTS attendance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    class_id INTEGER,
    student_id INTEGER,
    status TEXT CHECK(status IN ('present', 'absent', 'late')) NOT NULL,
    FOREIGN KEY (class_id) REFERENCES classes(id),
    FOREIGN KEY (student_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS assignments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subject_id INTEGER,
    title TEXT NOT NULL,
    description TEXT,
    deadline TEXT NOT NULL,
    total_marks INTEGER DEFAULT 100,
    FOREIGN KEY (subject_id) REFERENCES subjects(id)
  );

  CREATE TABLE IF NOT EXISTS submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    assignment_id INTEGER,
    student_id INTEGER,
    content TEXT,
    submission_date TEXT NOT NULL,
    marks INTEGER,
    feedback TEXT,
    status TEXT CHECK(status IN ('submitted', 'late', 'graded')) DEFAULT 'submitted',
    FOREIGN KEY (assignment_id) REFERENCES assignments(id),
    FOREIGN KEY (student_id) REFERENCES users(id)
  );
`);

// Seed initial users if not exists
const deptExists = db.prepare("SELECT * FROM departments").get();
if (!deptExists) {
  db.prepare("INSERT INTO departments (name, code) VALUES (?, ?)").run("Computer Science", "CSE");
  db.prepare("INSERT INTO departments (name, code) VALUES (?, ?)").run("Electrical Engineering", "EE");
}

const adminExists = db.prepare("SELECT * FROM users WHERE role = 'admin'").get();
if (!adminExists) {
  db.prepare("INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)").run(
    "admin@academia.edu",
    "admin123",
    "System Administrator",
    "admin"
  );
}

const staffExists = db.prepare("SELECT * FROM users WHERE role = 'staff'").get();
if (!staffExists) {
  db.prepare("INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)").run(
    "staff@academia.edu",
    "staff123",
    "Prof. Anderson",
    "staff"
  );
}

const studentExists = db.prepare("SELECT * FROM users WHERE role = 'student'").get();
if (!studentExists) {
  db.prepare("INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)").run(
    "student@academia.edu",
    "student123",
    "John Doe",
    "student"
  );
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // Auth API (Simplified for demo)
  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE email = ? AND password = ?").get(email, password);
    if (user) {
      res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role, department_id: user.department_id, course_id: user.course_id } });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  // Admin APIs
  app.get("/api/admin/stats", (req, res) => {
    const students = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'student'").get().count;
    const staff = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'staff'").get().count;
    const departments = db.prepare("SELECT COUNT(*) as count FROM departments").get().count;
    res.json({ students, staff, departments });
  });

  app.get("/api/departments", (req, res) => {
    res.json(db.prepare(`
      SELECT d.*, u.name as hod_name 
      FROM departments d 
      LEFT JOIN users u ON d.hod_id = u.id
    `).all());
  });

  app.post("/api/departments", (req, res) => {
    const { name, code, description, hod_id } = req.body;
    const result = db.prepare("INSERT INTO departments (name, code, description, hod_id) VALUES (?, ?, ?, ?)").run(
      name, code, description || null, hod_id || null
    );
    res.json({ id: result.lastInsertRowid, name, code });
  });

  app.get("/api/courses", (req, res) => {
    res.json(db.prepare(`
      SELECT c.*, d.name as department_name,
      (SELECT COUNT(*) FROM users u WHERE u.course_id = c.id AND u.role = 'student') as student_count,
      (SELECT COUNT(*) FROM subjects s WHERE s.course_id = c.id) as subject_count
      FROM courses c 
      JOIN departments d ON c.department_id = d.id
    `).all());
  });

  app.post("/api/courses", (req, res) => {
    const { name, code, department_id, duration_years, total_semesters, description } = req.body;
    const result = db.prepare(`
      INSERT INTO courses (name, code, department_id, duration_years, total_semesters, description) 
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      name, 
      code, 
      department_id, 
      duration_years || 4, 
      total_semesters || 8, 
      description || null
    );
    res.json({ id: result.lastInsertRowid, name, code });
  });

  app.get("/api/users", (req, res) => {
    const { role } = req.query;
    let query = "SELECT id, email, name, role, department_id, course_id FROM users";
    if (role) query += " WHERE role = ?";
    res.json(db.prepare(query).all(role ? [role] : []));
  });

  app.post("/api/users", (req, res) => {
    const { email, password, name, role, department_id, course_id } = req.body;
    const result = db.prepare("INSERT INTO users (email, password, name, role, department_id, course_id) VALUES (?, ?, ?, ?, ?, ?)").run(
      email, password, name, role, department_id || null, course_id || null
    );
    res.json({ id: result.lastInsertRowid, email, name, role });
  });

  // Staff & Subject APIs
  app.get("/api/subjects", (req, res) => {
    const { staff_id, course_id, department_id } = req.query;
    let query = `
      SELECT s.*, c.name as course_name, u.name as staff_name, d.name as department_name,
      (SELECT COUNT(*) FROM users st WHERE st.course_id = s.course_id AND st.role = 'student') as student_count,
      (SELECT COUNT(*) FROM classes cl WHERE cl.subject_id = s.id) as class_count,
      (SELECT COUNT(*) FROM assignments a WHERE a.subject_id = s.id) as assignment_count
      FROM subjects s 
      JOIN courses c ON s.course_id = c.id
      JOIN departments d ON c.department_id = d.id
      LEFT JOIN users u ON s.staff_id = u.id
    `;
    const params = [];
    const conditions = [];
    if (staff_id) {
      conditions.push("s.staff_id = ?");
      params.push(staff_id);
    }
    if (course_id) {
      conditions.push("s.course_id = ?");
      params.push(course_id);
    }
    if (department_id) {
      conditions.push("c.department_id = ?");
      params.push(department_id);
    }
    
    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }
    
    res.json(db.prepare(query).all(params));
  });

  app.post("/api/subjects", (req, res) => {
    const { name, code, course_id, staff_id, semester, credits, type, description } = req.body;
    const result = db.prepare(`
      INSERT INTO subjects (name, code, course_id, staff_id, semester, credits, type, description) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      name, code, course_id, staff_id || null, semester, credits || 3, type || 'core', description || null
    );
    res.json({ id: result.lastInsertRowid, name, code });
  });

  // Classes & Attendance
  app.get("/api/classes", (req, res) => {
    const { staff_id, student_id, date } = req.query;
    let query = `
      SELECT cl.*, s.name as subject_name 
      FROM classes cl 
      JOIN subjects s ON cl.subject_id = s.id
    `;
    const params = [];
    if (staff_id) {
      query += " WHERE s.staff_id = ?";
      params.push(staff_id);
    } else if (student_id) {
      query += " JOIN users u ON s.course_id = u.course_id WHERE u.id = ?";
      params.push(student_id);
    }
    if (date) {
      query += params.length ? " AND cl.date = ?" : " WHERE cl.date = ?";
      params.push(date);
    }
    res.json(db.prepare(query).all(params));
  });

  app.post("/api/classes", (req, res) => {
    const { subject_id, date, time, topic, description } = req.body;
    const result = db.prepare("INSERT INTO classes (subject_id, date, time, topic, description) VALUES (?, ?, ?, ?, ?)").run(
      subject_id, date, time, topic, description
    );
    res.json({ id: result.lastInsertRowid, subject_id, date, time });
  });

  app.get("/api/attendance", (req, res) => {
    const { class_id, student_id } = req.query;
    let query = "SELECT * FROM attendance";
    const params = [];
    if (class_id) {
      query += " WHERE class_id = ?";
      params.push(class_id);
    } else if (student_id) {
      query += " WHERE student_id = ?";
      params.push(student_id);
    }
    res.json(db.prepare(query).all(params));
  });

  app.post("/api/attendance", (req, res) => {
    const { class_id, student_id, status } = req.body;
    const existing = db.prepare("SELECT id FROM attendance WHERE class_id = ? AND student_id = ?").get(class_id, student_id);
    if (existing) {
      db.prepare("UPDATE attendance SET status = ? WHERE id = ?").run(status, existing.id);
    } else {
      db.prepare("INSERT INTO attendance (class_id, student_id, status) VALUES (?, ?, ?)").run(class_id, student_id, status);
    }
    res.json({ success: true });
  });

  // Assignments & Submissions
  app.get("/api/assignments", (req, res) => {
    const { staff_id, student_id } = req.query;
    let query = `
      SELECT a.*, s.name as subject_name 
      FROM assignments a 
      JOIN subjects s ON a.subject_id = s.id
    `;
    const params = [];
    if (staff_id) {
      query += " WHERE s.staff_id = ?";
      params.push(staff_id);
    } else if (student_id) {
      query += " JOIN users u ON s.course_id = u.course_id WHERE u.id = ?";
      params.push(student_id);
    }
    res.json(db.prepare(query).all(params));
  });

  app.post("/api/assignments", (req, res) => {
    const { subject_id, title, description, deadline, total_marks } = req.body;
    const result = db.prepare("INSERT INTO assignments (subject_id, title, description, deadline, total_marks) VALUES (?, ?, ?, ?, ?)").run(
      subject_id, title, description, deadline, total_marks
    );
    res.json({ id: result.lastInsertRowid, title });
  });

  app.get("/api/submissions", (req, res) => {
    const { assignment_id, student_id } = req.query;
    let query = "SELECT * FROM submissions";
    const params = [];
    if (assignment_id) {
      query += " WHERE assignment_id = ?";
      params.push(assignment_id);
    } else if (student_id) {
      query += " WHERE student_id = ?";
      params.push(student_id);
    }
    res.json(db.prepare(query).all(params));
  });

  app.post("/api/submissions", (req, res) => {
    const { assignment_id, student_id, content } = req.body;
    const submission_date = new Date().toISOString();
    const result = db.prepare("INSERT INTO submissions (assignment_id, student_id, content, submission_date) VALUES (?, ?, ?, ?)").run(
      assignment_id, student_id, content, submission_date
    );
    res.json({ id: result.lastInsertRowid });
  });

  app.patch("/api/submissions/:id", (req, res) => {
    const { marks, feedback } = req.body;
    db.prepare("UPDATE submissions SET marks = ?, feedback = ?, status = 'graded' WHERE id = ?").run(marks, feedback, req.params.id);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  // Seed subjects if empty
  const subjectCount = db.prepare("SELECT COUNT(*) as count FROM subjects").get() as { count: number };
  if (subjectCount.count === 0) {
    const cseCourse = db.prepare("SELECT id FROM courses WHERE code = 'BTECH-CSE'").get() as { id: number };
    const staffUser = db.prepare("SELECT id FROM users WHERE role = 'staff'").get() as { id: number };
    if (cseCourse && staffUser) {
      db.prepare(`
        INSERT INTO subjects (name, code, course_id, staff_id, semester, credits, type, description)
        VALUES 
        ('Data Structures', 'CS201', ?, ?, 2, 4, 'core', 'Fundamental data structures'),
        ('Discrete Mathematics', 'MA201', ?, ?, 2, 3, 'core', 'Mathematical foundations'),
        ('Computer Networks', 'CS202', ?, ?, 2, 4, 'core', 'Networking principles')
      `).run(cseCourse.id, staffUser.id, cseCourse.id, staffUser.id, cseCourse.id, staffUser.id);
    }
  }

  const PORT = 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
