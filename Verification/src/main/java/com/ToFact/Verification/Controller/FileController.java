//package com.ToFact.Verification.Controller;
//
//import java.io.File;
//
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RequestParam;
//import org.springframework.web.bind.annotation.RestController;
//import org.springframework.web.multipart.MultipartFile;
//
//import io.jsonwebtoken.io.IOException;
//
//@RestController
//@RequestMapping("/files")
//public class FileController {
//
//    @PostMapping("/upload")
//    public String uploadFile(@RequestParam MultipartFile file) throws IOException {
//
//        String path = "uploads/" + file.getOriginalFilename();
//        file.transferTo(new File(path));
//
//        return "File uploaded: " + path;
//    }
//}