package com.example.demo.service;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;
import java.util.Random;
import java.util.stream.Stream;

import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.exception.StorageFileNotFoundException;
import com.example.demo.model.User;
import com.example.demo.repository.ItemRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.FileSystemUtils;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FilesStorageServiceImpl implements FilesStorageService {
    private static final Path pictureRoot = Paths.get(System.getenv("PICTURES_ROOT"));
    private static final Path rootLogo = Paths.get(System.getenv("LOGO_ROOT"));
    private static final Path rootItemPictures = Paths.get(System.getenv("ITEMS_ROOT"));
    private static final Path rootAuctionPictures = Paths.get(System.getenv("AUCTIONS_ROOT"));
    private final UserRepository userRepository;
    private final String URL;
    private final ItemRepository itemRepository;

    @Autowired
    public FilesStorageServiceImpl(UserRepository userRepository, @Value("${SVN_URL}")String URL, ItemRepository itemRepository) {
        this.userRepository = userRepository;
        this.URL = URL;
        this.itemRepository = itemRepository;
    }


    @Override
    public void init() {
        try {
            if (!Files.exists(pictureRoot)) {
                Files.createDirectory(pictureRoot);
            }
            if (!Files.exists(rootLogo)) {
                Files.createDirectory(rootLogo);
            }
            if (!Files.exists(rootAuctionPictures)) {
                Files.createDirectory(rootAuctionPictures);
            }
            if (!Files.exists(rootItemPictures)) {
                Files.createDirectory(rootItemPictures);
            }
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize folder for upload!");
        }
    }

    @Override
    public void saveLogo(MultipartFile file, String username) {
        Random random = new Random();
        File uploadDir = new File(rootLogo + "/" + username);
            if (!uploadDir.exists())
                uploadDir.mkdir();
        Optional<User> user = userRepository.findByUsername(username);
        try {
            String resultName = username + "_" + random.nextInt(1000) + random.nextInt(1000) + file.getOriginalFilename();
            Files.copy(file.getInputStream(), Path.of(rootLogo + "/" + username).resolve(resultName));
            user.get().setLogo(resultName);
            userRepository.save(user.get());
        } catch (Exception e) {
            throw new RuntimeException("Could not store the file. Error: " + e.getMessage());
        }
    }

    public void savePictures(MultipartFile[] file, String itemId) {
        try {
            Path path  = Path.of("src/main/resources/pictures/items/item_" + itemId);
            if (!Files.exists(path)) {
                Files.createDirectory(path);
            }
            for (MultipartFile multipartFile : file) {
                Random random = new Random();
                String resultName = random.nextInt(1000) + random.nextInt(1000) + multipartFile.getOriginalFilename();
                Files.copy(multipartFile.getInputStream(), Path.of(rootItemPictures + "/item_" + itemId).resolve(resultName));
            }
        } catch (Exception e) {
            throw new RuntimeException("Could not store the file. Error: " + e.getMessage());
        }
    }

    @Override
    public void savePicture(MultipartFile file, String itemId) {
        try {
            Path path = Paths.get(rootItemPictures + "/item_" + itemId);
            if (!Files.exists(path)) {
                Files.createDirectory(path);
            }
            Random random = new Random();
            String resultName = random.nextInt(1000) + random.nextInt(1000) + file.getOriginalFilename();
            Files.copy(file.getInputStream(), Path.of(rootItemPictures + "/item_" + itemId).resolve(resultName));
        } catch (Exception e) {
            throw new RuntimeException("Could not store the file. Error: " + e.getMessage());
        }
    }

    @Override
    public void saveAuctionPicture(MultipartFile file, String auctionId) {
        try {
            Path path = Paths.get(rootAuctionPictures + "/auction_" + auctionId);
            if (!Files.exists(path)) {
                Files.createDirectory(path);
            }
            Random random = new Random();
            String resultName = random.nextInt(1000) + random.nextInt(1000) + file.getOriginalFilename();
            Files.copy(file.getInputStream(), Path.of(rootAuctionPictures + "/auction_" + auctionId).resolve(resultName));
        } catch (Exception e) {
            throw new RuntimeException("Could not store the file. Error: " + e.getMessage());
        }
    }

    @Override
    public Resource loadLogo(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
        try {
            Path file = Path.of(rootLogo + "/" + username).resolve(user.getLogo());
            Resource resource = new UrlResource(file.toUri());

            if (resource.exists() || resource.isReadable()) {
                return resource;
            } else {
                throw new RuntimeException("Could not read the file!");
            }
        } catch (MalformedURLException e) {
            throw new RuntimeException("Error: " + e.getMessage());
        }
    }

    @Override
    public Resource loadPicture(String itemId, String filename, String pathParam) {
        try {
            Path file = Path.of(pictureRoot + "/" + pathParam + "s/" + pathParam + "_" + itemId).resolve(filename);
            Resource resource = new UrlResource(file.toUri());
            if (resource.exists() || resource.isReadable()) {
                return resource;
            } else {
                throw new StorageFileNotFoundException("Could not read the file!");
            }
        } catch (MalformedURLException e) {
            throw new RuntimeException("Error: " + e.getMessage());
        }
    }

    @Override
    public Resource loadAuctionPicture(String auctionId, String filename, String pathParam) {
        try {
            Path file = Path.of(pictureRoot + "/" + pathParam + "s/" + pathParam + "_" + auctionId).resolve(filename);
            Resource resource = new UrlResource(file.toUri());
            if (resource.exists() || resource.isReadable()) {
                return resource;
            } else {
                throw new StorageFileNotFoundException("Could not read the file!");
            }
        } catch (MalformedURLException e) {
            throw new RuntimeException("Error: " + e.getMessage());
        }
    }

    @Override
    public void deleteAll() {
        FileSystemUtils.deleteRecursively(rootLogo.toFile());
    }

    @Override
    public Stream<Path> loadAll() {
        try {
            return Files.walk(this.rootLogo, 1).filter(path -> !path.equals(this.rootLogo)).map(this.rootLogo::relativize);
        } catch (IOException e) {
            throw new RuntimeException("Could not load the files!");
        }
    }

    @Override
    public String getFileExtension(File file) {
        String fileName = file.getName();
        if(fileName.lastIndexOf(".") != -1 && fileName.lastIndexOf(".") != 0) {
            return fileName.substring(fileName.lastIndexOf(".") + 1);
        }
        else return "";
    }
}