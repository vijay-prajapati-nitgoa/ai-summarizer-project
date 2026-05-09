const express = require("express");
const router = express.Router();
const multer = require("multer");
const pdfParse = require("pdf-parse");

const { Ollama } = require("ollama");

const ollama = new Ollama({
  host: "http://127.0.0.1:11434",
});

const upload = multer({
  storage: multer.memoryStorage(),
});


// ---------------- TEXT SUMMARIZATION ----------------

router.post("/summarize", async (req, res) => {

  try {

    let text = req.body.text;

    if (!text || text.trim() === "") {

      return res.json({
        summary: "Please enter some text",
      });

    }

    // reduce text size
    text = text
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 1000);

    const response = await ollama.chat({

      model: "tinyllama",

      messages: [
        {
          role: "user",
          content: `Summarize this text in short:\n${text}`,
        },
      ],

    });

    res.json({
      summary: response.message.content,
    });

  } catch (err) {

    console.log("TEXT ERROR:", err);

    res.json({
      summary: "Error generating summary",
    });

  }
});



// ---------------- PDF SUMMARIZATION ----------------

router.post(
  "/summarize-pdf",
  upload.single("file"),
  async (req, res) => {

    try {

      if (!req.file) {

        return res.json({
          summary: "No PDF uploaded",
        });

      }

      const pdfData = await pdfParse(req.file.buffer);

      let text = pdfData.text;

      if (!text || text.trim() === "") {

        return res.json({
          summary: "Could not read PDF",
        });

      }

      // reduce PDF size
      text = text
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 1000);

      const response = await ollama.chat({

        model: "tinyllama",

        messages: [
          {
            role: "user",
            content: `Summarize this PDF content in short:\n${text}`,
          },
        ],

      });

      res.json({
        summary: response.message.content,
      });

    } catch (err) {

      console.log("PDF ERROR:", err);

      res.json({
        summary: "Error summarizing PDF",
      });

    }
  }
);

module.exports = router;