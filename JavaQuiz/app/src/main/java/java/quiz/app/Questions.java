package java.quiz.app;

import androidx.appcompat.app.ActionBar;
import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;

public class Questions extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_questions);
        ActionBar actionBar = getSupportActionBar();

        actionBar.setTitle("Witaj "+getIntent().getStringExtra("username"));
        actionBar.setSubtitle("Pytanie "+1+" z 10");

        String questionsString = getIntent().getStringExtra("questions");

        System.out.println(questionsString);

    }
}