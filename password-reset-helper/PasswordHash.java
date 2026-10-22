import java.io.Console;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordHash {
    public static void main(String[] args) {
        Console console = System.console();
        if (console == null) {
            System.err.println("Run this directly in PowerShell.");
            System.exit(1);
        }

        char[] password = console.readPassword("Enter your new staff1 password: ");
        try {
            String rawPassword = new String(password);
            if (rawPassword.length() < 8) {
                System.err.println("Password must be at least 8 characters.");
                System.exit(1);
            }

            String hash = new BCryptPasswordEncoder().encode(rawPassword);
            System.out.println("BCrypt hash:");
            System.out.println(hash);
        } finally {
            java.util.Arrays.fill(password, '\0');
        }
    }
}
