CREATE TABLE notebook (
    id INT PRIMARY KEY AUTO_INCREMENT,
    uuid VARCHAR(64) UNIQUE,
    user_uuid TEXT,
    title TEXT,
    content TEXT,
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    active BOOLEAN
);


CREATE TABLE notesource (
    id INT PRIMARY KEY AUTO_INCREMENT,
    uuid VARCHAR(64) UNIQUE,
    title TEXT,
    content TEXT,
    type VARCHAR(32),
    url TEXT,
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    active BOOLEAN
);


CREATE TABLE note_book_source (
    id INT PRIMARY KEY AUTO_INCREMENT,
    notebook_id INT,
    notesource_id INT,
    UNIQUE(notebook_id, notesource_id),
    FOREIGN KEY (notebook_id) REFERENCES notebook(id) ON DELETE CASCADE,
    FOREIGN KEY (notesource_id) REFERENCES notesource(id) ON DELETE CASCADE
);


CREATE TABLE note (
    id INT PRIMARY KEY AUTO_INCREMENT,
    uuid VARCHAR(64) UNIQUE,
    title TEXT,
    content TEXT,
    type VARCHAR(32),
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    active BOOLEAN
);


CREATE TABLE note_book_note (
    id INT PRIMARY KEY AUTO_INCREMENT,
    notebook_id INT,
    note_id INT,
    UNIQUE(notebook_id, note_id),
    FOREIGN KEY (notebook_id) REFERENCES notebook(id) ON DELETE CASCADE,
    FOREIGN KEY (note_id) REFERENCES note(id) ON DELETE CASCADE
);
