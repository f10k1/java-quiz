package java.quiz.app;

import android.os.Parcel;
import android.os.Parcelable;
import android.widget.RadioButton;

import androidx.annotation.NonNull;

public class Answer {

    public Integer id;
    public Boolean checked = false;
    public String value;
    private RadioButton view;

    public Answer(Integer id, String value, RadioButton view){}

    public Boolean getChecked() {
        return checked;
    }

    public void setChecked(Boolean checked) {
        this.checked = checked;
        view.setChecked(checked);
    }

}
