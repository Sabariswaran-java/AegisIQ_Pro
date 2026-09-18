package com.aegis.aegisiq.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/ai/rag-audit")
public class RagAuditController {

    @PostMapping("/analyze")
    public ResponseEntity<?> analyzeLogFile(@RequestParam("file") MultipartFile file) {
        // File analysis logic inge varum
        return ResponseEntity.ok("Log file analyzed successfully!");
    }
}
