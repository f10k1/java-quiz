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

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
    }

    public void onStartQuiz(View view) {
        Intent intent = new Intent(this, QuestionsActivity.class);
        EditText username = findViewById(R.id.login);
        Animation shake = AnimationUtils.loadAnimation(this, R.anim.shake);

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