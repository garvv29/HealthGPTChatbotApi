# 📱 Flutter Integration Guide

## 🏗️ Architecture

```
Flutter App (Frontend)
    ↓ (HTTP POST request)
    ↓
Node.js Server (Backend) - http://localhost:3000/chat
    ↓
Groq API
    ↓ (AI Response)
Groq API
    ↓
Node.js Server
    ↓ (Response JSON)
Flutter App (Display Response)
```

---

## 📋 Step 1: Setup Flutter Project

### Add Dependencies to `pubspec.yaml`

```yaml
dependencies:
  flutter:
    sdk: flutter
  http: ^1.1.0
```

### Run:
```bash
flutter pub get
```

---

## 🔌 Step 2: Create Chat Service

**File: `lib/services/chat_service.dart`**

```dart
import 'package:http/http.dart' as http;
import 'dart:convert';

class ChatService {
  // For Android Emulator
  final String apiUrl = "http://10.0.2.2:3000/chat";
  
  // For Physical Device (replace with your computer's IP)
  // final String apiUrl = "http://192.168.1.100:3000/chat";
  // final String apiUrl = "http://YOUR_COMPUTER_IP:3000/chat";

  /// Send message to Groq API via Node.js backend
  Future<String> sendMessage(String message) async {
    try {
      print("📤 Sending message: $message");

      final response = await http.post(
        Uri.parse(apiUrl),
        headers: {
          "Content-Type": "application/json",
        },
        body: jsonEncode({
          "message": message,
        }),
      ).timeout(
        Duration(seconds: 30),
        onTimeout: () {
          throw Exception("Request timeout - server not responding");
        },
      );

      print("📬 Response Status: ${response.statusCode}");
      print("📬 Response Body: ${response.body}");

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        
        if (data['success'] == true) {
          return data['reply']; // AI ka response
        } else {
          return "❌ Error: ${data['error']}";
        }
      } else {
        return "❌ Server Error: ${response.statusCode}";
      }
    } catch (e) {
      print("❌ Exception: $e");
      return "❌ Connection Error: $e";
    }
  }
}
```

---

## 🎨 Step 3: Create Chat Screen

**File: `lib/screens/chat_screen.dart`**

```dart
import 'package:flutter/material.dart';
import '../services/chat_service.dart';

class ChatScreen extends StatefulWidget {
  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final ChatService _chatService = ChatService();
  final TextEditingController _controller = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  
  List<Map<String, String>> messages = [];
  bool isLoading = false;

  @override
  void initState() {
    super.initState();
    // Welcome message
    messages.add({
      "role": "bot",
      "text": "👋 Namaste! Main Groq ke Llama AI model se powered hoon. Mujhe kuch bhi pooch sakte ho! 🤖"
    });
  }

  void sendMessage() async {
    String userMessage = _controller.text.trim();
    
    if (userMessage.isEmpty) return;

    // Add user message to UI
    setState(() {
      messages.add({"role": "user", "text": userMessage});
      isLoading = true;
    });
    
    _controller.clear();
    _scrollToBottom();

    // Get response from API
    String reply = await _chatService.sendMessage(userMessage);

    // Add bot response to UI
    setState(() {
      messages.add({"role": "bot", "text": reply});
      isLoading = false;
    });
    
    _scrollToBottom();
  }

  void _scrollToBottom() {
    Future.delayed(Duration(milliseconds: 100), () {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("🤖 Groq Chatbot"),
        centerTitle: true,
        backgroundColor: Color(0xFF667eea),
        elevation: 0,
      ),
      body: Column(
        children: [
          // Chat Messages
          Expanded(
            child: messages.isEmpty
                ? Center(
                    child: Text("No messages yet"),
                  )
                : ListView.builder(
                    controller: _scrollController,
                    itemCount: messages.length,
                    padding: EdgeInsets.all(12),
                    itemBuilder: (context, index) {
                      bool isUser = messages[index]["role"] == "user";
                      return Align(
                        alignment: isUser 
                            ? Alignment.centerRight 
                            : Alignment.centerLeft,
                        child: Container(
                          margin: EdgeInsets.symmetric(vertical: 8),
                          padding: EdgeInsets.symmetric(
                            horizontal: 16,
                            vertical: 12,
                          ),
                          decoration: BoxDecoration(
                            color: isUser 
                                ? Color(0xFF667eea) 
                                : Colors.grey[300],
                            borderRadius: BorderRadius.only(
                              topLeft: Radius.circular(18),
                              topRight: Radius.circular(18),
                              bottomLeft: Radius.circular(
                                isUser ? 18 : 4,
                              ),
                              bottomRight: Radius.circular(
                                isUser ? 4 : 18,
                              ),
                            ),
                          ),
                          constraints: BoxConstraints(
                            maxWidth: MediaQuery.of(context).size.width * 0.75,
                          ),
                          child: Text(
                            messages[index]["text"]!,
                            style: TextStyle(
                              color: isUser ? Colors.white : Colors.black87,
                              fontSize: 15,
                              height: 1.4,
                            ),
                          ),
                        ),
                      );
                    },
                  ),
          ),

          // Loading Indicator
          if (isLoading)
            Padding(
              padding: EdgeInsets.all(12),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  SizedBox(
                    width: 20,
                    height: 20,
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      valueColor: AlwaysStoppedAnimation<Color>(
                        Color(0xFF667eea),
                      ),
                    ),
                  ),
                  SizedBox(width: 10),
                  Text("AI soch raha hai..."),
                ],
              ),
            ),

          // Input Field
          Padding(
            padding: EdgeInsets.all(12),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _controller,
                    enabled: !isLoading,
                    decoration: InputDecoration(
                      hintText: "Apna message likho...",
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(25),
                        borderSide: BorderSide(
                          color: Color(0xFF667eea),
                        ),
                      ),
                      enabledBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(25),
                        borderSide: BorderSide(
                          color: Color(0xFF667eea),
                        ),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(25),
                        borderSide: BorderSide(
                          color: Color(0xFF667eea),
                          width: 2,
                        ),
                      ),
                      contentPadding: EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 12,
                      ),
                    ),
                    onSubmitted: (_) => sendMessage(),
                  ),
                ),
                SizedBox(width: 8),
                FloatingActionButton(
                  onPressed: isLoading ? null : sendMessage,
                  backgroundColor: Color(0xFF667eea),
                  disabledElevation: 0,
                  elevation: 8,
                  child: Icon(
                    Icons.send,
                    color: Colors.white,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    _scrollController.dispose();
    super.dispose();
  }
}
```

---

## 🚀 Step 4: Update Main.dart

**File: `lib/main.dart`**

```dart
import 'package:flutter/material.dart';
import 'screens/chat_screen.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Groq Chatbot',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primarySwatch: Colors.blue,
        useMaterial3: true,
      ),
      home: ChatScreen(),
    );
  }
}
```

---

## 🌐 IP Address Configuration

### For Android Emulator:
```dart
final String apiUrl = "http://10.0.2.2:3000/chat";
```

### For Physical Device:

1. **Find your computer's IP:**
   ```bash
   ipconfig
   ```
   Look for `IPv4 Address` (example: `192.168.1.100`)

2. **Update in `chat_service.dart`:**
   ```dart
   final String apiUrl = "http://192.168.1.100:3000/chat";
   ```

3. **Make sure:**
   - Flutter device और computer same WiFi par hain
   - Node.js server running hai
   - Firewall port 3000 ko allow kar rahe

---

## 📤 API Request/Response Flow

### Request (Flutter → Node.js):
```json
{
  "message": "What is Flutter?"
}
```

### Response (Node.js → Flutter):
```json
{
  "reply": "Flutter is a UI framework...",
  "success": true
}
```

### Error Response:
```json
{
  "error": "Something went wrong",
  "details": "API Error",
  "success": false
}
```

---

## 🧪 Testing Steps

1. **Start Node.js Server:**
   ```bash
   cd c:\Users\garvc\Desktop\Chabot
   npm start
   ```

2. **Test Web UI First:**
   Open: `http://localhost:3000`

3. **Run Flutter:**
   ```bash
   flutter run
   ```

4. **Send Message:**
   - Type: "Hello!"
   - See response in 2-3 seconds

---

## ⚡ Performance Tips

- **Timeout:** 30 seconds (adjust if needed)
- **Loading indicator:** Show while waiting
- **Scroll:** Auto-scroll to latest message
- **Cache:** Consider caching responses

---

## 🐛 Debugging

### Debug Print Statements:
```dart
print("📤 Sending message: $message");
print("📬 Response Status: ${response.statusCode}");
print("❌ Exception: $e");
```

### Flutter Console:
```bash
flutter logs
```

### Network Inspector:
- Use Charles Proxy or Fiddler to inspect requests

---

## ⚠️ Common Issues

### 1. Connection Refused
- **Problem:** Server not running
- **Fix:** `npm start` in backend folder

### 2. Wrong IP Address
- **Problem:** Device can't reach computer
- **Fix:** Update IP in `chat_service.dart`

### 3. Timeout Error
- **Problem:** Network too slow
- **Fix:** Increase timeout to 60 seconds

### 4. CORS Error (Web)
- **Status:** Already handled in Node.js

---

## 📊 Message Structure

```dart
{
  "role": "user",      // "user" or "bot"
  "text": "message"    // Actual message content
}
```

---

## 🎯 Next Steps

1. ✅ Create `chat_service.dart`
2. ✅ Create `chat_screen.dart`
3. ✅ Update `main.dart`
4. ✅ Configure correct IP address
5. ✅ Run `flutter run`
6. ✅ Test sending messages

---

## 📞 Support

- **Groq Docs:** https://console.groq.com/docs
- **Flutter Docs:** https://flutter.dev/docs
- **HTTP Package:** https://pub.dev/packages/http

---

**Happy Coding! 🚀**
