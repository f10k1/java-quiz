package java.quiz.app;

import androidx.appcompat.app.ActionBar;
import androidx.appcompat.app.AppCompatActivity;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.constraintlayout.widget.ConstraintSet;

import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Bundle;
import android.util.Base64;
import android.view.View;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.TextView;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;

public class QuestionsActivity extends AppCompatActivity {

    private QuestionService questionService = new QuestionService();
    private JSONArray questions;
    private Integer questionNumber = 1;
    private RadioGroup radioGroup;
    private LinearLayout checkboxes;
    private TextView txtAsset;
    ImageView imageView;
    private JSONArray selectedAnswers = new JSONArray();
    private void updateQuestionsCounter(){
        ActionBar actionBar = getSupportActionBar();
        actionBar.setSubtitle("Pytanie "+questionNumber+" z "+questions.length());
    }

    private void updateQuestion(){
        TextView questionTextBox = (TextView) findViewById(R.id.question);
        try{
            JSONObject currentQuestion = questions.getJSONObject(questionNumber-1);
            questionTextBox.setText(currentQuestion.getString("name"));
            JSONArray answers = currentQuestion.getJSONArray("answers");

            ConstraintLayout constraintLayout = findViewById(R.id.parentLayout);
            ConstraintSet constraintSet = new ConstraintSet();
            constraintSet.clone(constraintLayout);
            radioGroup.clearCheck();
            radioGroup.removeAllViews();
            checkboxes.removeAllViews();
            imageView.setImageDrawable(null);
            txtAsset.setText("");
            checkboxes.setVisibility(View.INVISIBLE);
            radioGroup.setVisibility(View.INVISIBLE);
            imageView.setVisibility(View.INVISIBLE);
            txtAsset.setVisibility(View.INVISIBLE);
            if(currentQuestion.getString("file") != null){
                String type = currentQuestion.getString("fileName").substring(currentQuestion.getString("fileName").lastIndexOf('.') + 1);

                byte[] bytes= Base64.decode(currentQuestion.getString("file"),Base64.URL_SAFE);
                if (type.equals("txt") || type.equals("java")){
                    String content = new String(bytes, StandardCharsets.UTF_8);
                    txtAsset.setText(content);
                    txtAsset.setVisibility(View.VISIBLE);
                }
                else{
                    Bitmap bitmap= BitmapFactory.decodeByteArray(bytes,0,bytes.length);
                    imageView.setImageBitmap(bitmap);
                    imageView.setVisibility(View.VISIBLE);
                }
            }
            switch (currentQuestion.getString("type")){
                case "ONE_CHOICE":

                    radioGroup.setVisibility(View.VISIBLE);
                    RadioButton button;
                    if(currentQuestion.getString("file") != null){
                        String type = currentQuestion.getString("fileName").substring(currentQuestion.getString("fileName").lastIndexOf('.') + 1);
                        if (type.equals("txt") || type.equals("java")){
                            constraintSet.connect(R.id.radios, ConstraintSet.TOP, R.id.txtAsset, ConstraintSet.BOTTOM, 36);
                            constraintSet.applyTo(constraintLayout);
                        }
                        else{
                            constraintSet.connect(R.id.radios, ConstraintSet.TOP, R.id.imgAsset, ConstraintSet.BOTTOM, 36);
                            constraintSet.applyTo(constraintLayout);
                        }

                    }
                    for(Integer index =0; index< answers.length(); index++){
                        button = new RadioButton(this);
                        JSONObject answer = answers.getJSONObject(index);
                        button.setId(answer.getInt("id"));
                        button.setText(answer.getString("title"));

                        radioGroup.addView(button);
                    }
                    break;
                case "MULTI_CHOICE":
                    checkboxes.setVisibility(View.VISIBLE);
                    CheckBox checkBox;
                    if(currentQuestion.getString("file") != null){
                        String type = currentQuestion.getString("fileName").substring(currentQuestion.getString("fileName").lastIndexOf('.') + 1);
                        if (type.equals("txt") || type.equals("java")){
                            constraintSet.connect(R.id.checkboxes, ConstraintSet.TOP, R.id.txtAsset, ConstraintSet.BOTTOM, 36);
                            constraintSet.applyTo(constraintLayout);
                        }
                        else{
                            constraintSet.connect(R.id.checkboxes, ConstraintSet.TOP, R.id.imgAsset, ConstraintSet.BOTTOM, 36);
                            constraintSet.applyTo(constraintLayout);
                        }
                    }
                    for(Integer index =0; index< answers.length(); index++){
                        checkBox = new CheckBox(this);
                        JSONObject answer = answers.getJSONObject(index);

                        checkBox.setId(answer.getInt("id"));
                        checkBox.setText(answer.getString("title"));

                        checkboxes.addView(checkBox);
                    }
            }

        }
        catch (Exception err){
            System.out.println(err.getMessage());
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.activity_questions);

        ActionBar actionBar = getSupportActionBar();

        actionBar.setTitle("Witaj "+getIntent().getStringExtra("username"));

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
                    try{
                        questions = new JSONArray(value);
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

        radioGroup = findViewById(R.id.radios);
        checkboxes = findViewById(R.id.checkboxes);
        txtAsset = findViewById(R.id.txtAsset);
        imageView = findViewById(R.id.imgAsset);

        updateQuestionsCounter();
        updateQuestion();
    }

    public void nextQuestion(View view){
        try{
            selectAnswer();

            questionNumber += 1;
            updateQuestionsCounter();
            updateQuestion();

            if (questionNumber >= questions.length()){
                Button nextQuestion = findViewById(R.id.nextQuestion);
                Button saveQuiz = findViewById(R.id.saveQuiz);

                nextQuestion.setVisibility(View.INVISIBLE);
                saveQuiz.setVisibility(View.VISIBLE);
            }
        }
        catch(Exception err){
            System.out.println(err);
        }
    }

    private void selectAnswer(){
        try {
            JSONObject currentQuestion = questions.getJSONObject(questionNumber - 1);
            String type = currentQuestion.getString("type");
            ArrayList<Integer> answer = new ArrayList<Integer>();
            if (type.equals("ONE_CHOICE")) {
                Integer radio = radioGroup.getCheckedRadioButtonId();
                answer.add(radio);
            } else if (type.equals("MULTI_CHOICE")) {
                for (Integer index = 0; index < checkboxes.getChildCount(); index++) {
                    CheckBox checkBox = (CheckBox) checkboxes.getChildAt(index);
                    System.out.println("");
                    if (checkBox.isChecked()) {
                        answer.add(checkBox.getId());
                    }
                }
            }
            JSONObject answerObj = new JSONObject();
            answerObj.put("questionId",currentQuestion.getString("id"));
            answerObj.put("answersId",new JSONArray(answer));

            selectedAnswers.put(answerObj);

        }
        catch (Exception err){
            System.out.println(err.getMessage());
        }
    }

    public void saveQuestions(View view){
        Intent intent = new Intent(this, ScoreActivity.class);
        selectAnswer();
        System.out.println(selectedAnswers.toString());

        intent.putExtra("answers", selectedAnswers.toString());
        startActivity(intent);
        finish();
    }
}