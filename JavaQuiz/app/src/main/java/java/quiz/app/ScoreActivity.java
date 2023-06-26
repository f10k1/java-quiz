package java.quiz.app;

import android.graphics.Color;
import android.os.Bundle;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.ContextCompat;

import org.json.JSONException;
import org.json.JSONObject;

public class ScoreActivity extends AppCompatActivity {

    private QuestionService questionService = new QuestionService();
    private JSONObject result;
    private TextView scoreTextBox;
    private TextView pointsTextBox;
    private TextView gradeTextBox;

    @Override
    public void onCreate(Bundle savedInstanceState){
        super.onCreate(savedInstanceState);

        setContentView(R.layout.activity_score);

        scoreTextBox = findViewById(R.id.score);
        pointsTextBox = findViewById(R.id.points);
        gradeTextBox = findViewById(R.id.grade);

        try{
            Runnable request = new CustomRunnable<Void, String>((t) -> {
                try {
                     JSONObject response = new JSONObject(questionService.saveAnswers(getIntent().getStringExtra("answers")));
                     scoreTextBox.setText("Zdobyłeś: "+ response.getString("percentage")+"%");
                     pointsTextBox.setText("Liczba punktów: "+ response.getString("points"));
                     gradeTextBox.setText("Ocena: "+ response.getString("grade"));
                     if (response.getInt("grade") == 2) gradeTextBox.setTextColor(ContextCompat.getColor(this, R.color.red));
                }
                catch (Exception err){
                    System.out.println(err.getMessage());
                    pointsTextBox.setText(err.getMessage());
                    pointsTextBox.setTextColor(ContextCompat.getColor(this, R.color.red));
                }

                return null;
            },null, new CustomCallback() {
                @Override
                public void onStringReceived(String value) {
                    try{
                        result = new JSONObject(value);
                    }
                    catch (JSONException err){
                        System.out.println(err.getMessage());
                    }
                }
            });
            Thread thread = new Thread(request);
            thread.start();
            thread.join();
        }
        catch (Exception err){
            System.out.println(err);
        }
    }
}
