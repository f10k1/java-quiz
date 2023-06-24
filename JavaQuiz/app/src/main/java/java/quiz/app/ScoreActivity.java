package java.quiz.app;

import android.os.Bundle;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

import org.json.JSONException;
import org.json.JSONObject;

public class ScoreActivity extends AppCompatActivity {

    private QuestionService questionService = new QuestionService();
    private JSONObject result;
    private TextView scoreTextBox;

    @Override
    public void onCreate(Bundle savedInstanceState){
        super.onCreate(savedInstanceState);

        setContentView(R.layout.activity_score);

        scoreTextBox = findViewById(R.id.score);

        try{
            Runnable request = new CustomRunnable<Void, String>((t) -> {
                try {
                     JSONObject response = new JSONObject(questionService.saveAnswers(getIntent().getStringExtra("answers")));
                     scoreTextBox.setText("Zdobyłeś: "+ response.getString("percentage")+"%");
                }
                catch (Exception err){
                    System.out.println(err.getMessage());
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
