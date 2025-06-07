import React, { useState, useEffect } from "react";
import "./App.css"; // Make sure this file contains the .superscript CSS

// Bible books in order
const books = [
  // Old Testament
  "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy",
  "Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel", "1 Kings", "2 Kings",
  "1 Chronicles", "2 Chronicles", "Ezra", "Nehemiah", "Esther", "Job", "Psalms",
  "Proverbs", "Ecclesiastes", "Song of Solomon", "Isaiah", "Jeremiah", "Lamentations",
  "Ezekiel", "Daniel", "Hosea", "Joel", "Amos", "Obadiah", "Jonah", "Micah", "Nahum",
  "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi",
  // New Testament
  "Matthew", "Mark", "Luke", "John", "Acts", "Romans", "1 Corinthians", "2 Corinthians",
  "Galatians", "Ephesians", "Philippians", "Colossians", "1 Thessalonians", "2 Thessalonians",
  "1 Timothy", "2 Timothy", "Titus", "Philemon", "Hebrews", "James", "1 Peter", "2 Peter",
  "1 John", "2 John", "3 John", "Jude", "Revelation"
];

// Bible version IDs from API.Bible
const bibleVersions = {
  kjv: "de4e12af7f28f599-02",
  niv: "06125adad2d5898a-01",
  nlt: "fa3e5b1c58944b83-01",
};

// Your API key
const API_KEY = "85c2883ec44c9dace59061808eb43b25";

// Format verse numbers to look like superscript using <span class="superscript">
const formatVerses = (html) => {
  return html.replace(/(^|\s)(\d+)(?=\s[A-Z])/g, '$1<span class="superscript">$2</span>');
};

function App() {
  const [book, setBook] = useState("Genesis");
  const [chapter, setChapter] = useState(1);
  const [translation, setTranslation] = useState("kjv");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true); // Dark mode toggle

  useEffect(() => {
    const fetchChapter = async () => {
      setLoading(true);
      const bibleId = bibleVersions[translation];
      const chapterId = `${book.replace(/\s/g, "").toUpperCase().substring(0, 3)}.${chapter}`;

      try {
        const response = await fetch(
          `https://api.scripture.api.bible/v1/bibles/${bibleId}/chapters/${chapterId}?content-type=html`,
          {
            headers: {
              "api-key": "85c2883ec44c9dace59061808eb43b25",
            },
          }
        );

        const data = await response.json();

        if (data?.data?.content) {
          setContent(formatVerses(data.data.content)); // Apply superscript formatting
        } else {
          setContent("<p>No content found.</p>");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setContent("<p>Failed to load passage.</p>");
      }

      setLoading(false);
    };

    fetchChapter();
  }, [book, chapter, translation]);

  return (
    <div
      style={{
        fontFamily: "sans-serif",
        padding: "2rem",
        backgroundColor: darkMode ? "#121212" : "#f9f9f9",
        color: darkMode ? "#f1f1f1" : "#1a1a1a",
        minHeight: "100vh",
      }}
    >
      {/* Toggle Dark Mode */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        style={{
          backgroundColor: darkMode ? "#333" : "#ddd",
          color: darkMode ? "#fff" : "#000",
          border: "none",
          padding: "0.5rem 1rem",
          borderRadius: "5px",
          cursor: "pointer",
          marginBottom: "1rem",
        }}
      >
        {darkMode ? "☀️" : "🌙"}
      </button>
      <h1>Bible Reader 📖</h1>

      

      {/* Translation Selector */}
      <select
        value={translation}
        onChange={(e) => setTranslation(e.target.value)}
        style={{ marginRight: "1rem" }}
      >
        <option value="kjv">KJV</option>
        <option value="niv">NIV</option>
        <option value="nlt">NLT</option>
      </select>

      {/* Book Dropdown */}
      <select
        value={book}
        onChange={(e) => setBook(e.target.value)}
        style={{ marginRight: "1rem" }}
      >
        <optgroup label="📜 Old Testament">
          {books.slice(0, 39).map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </optgroup>
        <optgroup label="✝️ New Testament">
          {books.slice(39).map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </optgroup>
      </select>

      {/* Chapter Input */}
      <input
        type="number"
        min="1"
        value={chapter}
        onChange={(e) => setChapter(Number(e.target.value))}
        style={{ width: "60px" }}
      />

      {/* Bible Content */}
      {loading ? (
        <p style={{ marginTop: "2rem" }}>Loading...</p>
      ) : (
        <div
          style={{
            marginTop: "2rem",
            backgroundColor: darkMode ? "#1e1e1e" : "#ffffff",
            padding: "1rem",
            borderRadius: "10px",
            lineHeight: "1.6",
          }}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )}
    </div>
  );
}

export default App;
