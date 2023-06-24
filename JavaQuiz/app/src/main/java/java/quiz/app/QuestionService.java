package java.quiz.app;

import static androidx.core.content.ContextCompat.getSystemService;

import android.content.Context;
import android.net.ConnectivityManager;
import android.os.AsyncTask;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.StringWriter;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.Scanner;
import java.util.concurrent.Executor;

import javax.net.ssl.HttpsURLConnection;

public class QuestionService {
    private final String baseUrl = "http://10.0.2.2:8090";

    String getQuestions() throws IOException {
        URL url = new URL(baseUrl+"/public/questions?limit=10");
        HttpURLConnection urlConnection = (HttpURLConnection) url.openConnection();

        urlConnection.connect();

        InputStream inputStream = urlConnection.getInputStream();

        Scanner scanner = new Scanner(inputStream).useDelimiter("\\A");
        String result = scanner.hasNext() ? scanner.next() : "";
        return result;
    }

    String saveAnswers(String answers) throws IOException {
        URL url = new URL(baseUrl+"/public/submit");
        HttpURLConnection urlConnection = (HttpURLConnection) url.openConnection();

        urlConnection.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
        urlConnection.setRequestProperty("Accept", "application/json");

        urlConnection.setRequestMethod("POST");
        OutputStream os = urlConnection.getOutputStream();
        os.write(answers.getBytes(StandardCharsets.UTF_8));
        os.close();

        urlConnection.connect();

        InputStream inputStream = urlConnection.getInputStream();

        Scanner scanner = new Scanner(inputStream).useDelimiter("\\A");

        String result = scanner.hasNext() ? scanner.next() : "";
        return result;
    }
}