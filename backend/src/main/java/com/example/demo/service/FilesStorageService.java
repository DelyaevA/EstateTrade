package com.example.demo.service;

import java.io.File;
import java.nio.file.Path;
import java.util.List;
import java.util.stream.Stream;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface FilesStorageService {
    public void init();

    public void saveLogo(MultipartFile file, String username);

    public void savePictures(MultipartFile[] file, String itemId);

    public void saveAuctionPicture(MultipartFile file, String auctionId);

    public void savePicture(MultipartFile file, String itemId);

    public Resource loadLogo(String username);

    public Resource loadPicture(String itemId, String filename, String pathParam);

    public Resource loadAuctionPicture(String itemId, String filename, String pathParam);

    public void deleteAll();

    public Stream<Path> loadAll();

    public String getFileExtension(File file);

/*    public List<String> loadItemPictures(Long idPicture);*/
}