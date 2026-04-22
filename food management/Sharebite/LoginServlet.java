package controller;

import java.io.*;
import javax.servlet.*;
import javax.servlet.http.*;
import java.net.HttpURLConnection;
import java.net.URL;

public class LoginServlet extends HttpServlet {

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String email = request.getParameter("email");
        String psw = request.getParameter("psw");

        URL url = new URL("http://localhost:3000/don_login_submit");
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();

        conn.setRequestMethod("POST");
        conn.setDoOutput(true);
        conn.setRequestProperty("Content-Type", "application/json");

        String jsonInput = "{\"email\":\"" + email + "\", \"psw\":\"" + psw + "\"}";

        OutputStream os = conn.getOutputStream();
        os.write(jsonInput.getBytes());
        os.flush();

        int responseCode = conn.getResponseCode();

        if (responseCode == 200) {
            request.setAttribute("name", email);
            RequestDispatcher rd = request.getRequestDispatcher("home.jsp");
            rd.forward(request, response);
        } else {
            response.sendRedirect("login.jsp");
        }
    }
}