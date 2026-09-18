package com.aegis.aegisiq.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/ai/rag-audit")
public class RagAuditController {

    @PostMapping("/analyze")
    public ResponseEntity<?> analyzeLogFile(@RequestParam("file") MultipartFile file) {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Log file analyzed successfully");
        response.put("filename", file.getOriginalName());
        return ResponseEntity.ok(response);
    }
}
