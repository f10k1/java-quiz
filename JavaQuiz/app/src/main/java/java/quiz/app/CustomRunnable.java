package java.quiz.app;

import java.lang.reflect.Method;
import java.util.function.Function;
import java.util.function.Supplier;

public class CustomRunnable<T, R> implements Runnable{

    private CustomCallback callback;

    protected Function<T, R> func;
    protected T args;

    public CustomRunnable(Function<T, R> func, T args, CustomCallback callback){
        this.func = func;
        this.args = args;
        System.out.println(callback.toString());
        this.callback = callback;
    }

    @Override
    public void run() {
        try{
            R result = func.apply(args);
            callback.onStringReceived(result.toString());
        }
        catch (Exception err){
        }
    }
}
