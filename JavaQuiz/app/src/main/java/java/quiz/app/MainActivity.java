package java.quiz.app;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.ContextCompat;
import androidx.core.graphics.drawable.DrawableCompat;

import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.View;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.EditText;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

import javax.net.ssl.HttpsURLConnection;

public class MainActivity extends AppCompatActivity {

    private QuestionService questionService = new QuestionService();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
    }

    public void onStartQuiz(View view) {
        Intent intent = new Intent(this, Questions.class);
        EditText username = findViewById(R.id.login);
        Animation shake = AnimationUtils.loadAnimation(this, R.anim.shake);
        try{
            Runnable request = new CustomRunnable<Void, String>((t) -> {
                try {
                    return questionService.getQuestions();
                }
                catch (Exception err){
                    System.out.println(err.getMessage());
                }

                return null;
                },null, new CustomCallback() {
                    @Override
                    public void onStringReceived(String value) {
                        intent.putExtra("questions", value);
                    }
                });
            Thread thread = new Thread(request);
            thread.start();
            thread.join();
        }
        catch (Exception err){
            System.out.println(err);
        }

        if (TextUtils.isEmpty(username.getText())) {
            username.setError("Wypełnij to pole");
            DrawableCompat.setTint(username.getBackground(), ContextCompat.getColor(this, R.color.red));
            username.setAnimation(shake);
            return;
        }else{

            intent.putExtra("username", username.getText().toString());
            startActivity(intent);
            finish();
        }
    }
}