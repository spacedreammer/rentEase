<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\User; // To interact with users
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB; // For raw queries if needed for performance
use Illuminate\Validation\ValidationException;

class MessageController extends Controller
{
    /**
     * Display a list of conversations for the authenticated user.
     * A conversation is identified by the other participant.
     */
    public function index()
    {
        $user = Auth::user();

        // Get unique users involved in conversations with the current user
        $conversations = Message::where('sender_id', $user->id)
            ->orWhere('receiver_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get()
            ->groupBy(function ($message) use ($user) {
                return $message->sender_id === $user->id ? $message->receiver_id : $message->sender_id;
            })
            ->map(function ($group) {
                $latestMessage = $group->sortByDesc('created_at')->first();
                $otherUser = $latestMessage->sender_id === Auth::id() ? $latestMessage->receiver : $latestMessage->sender;
                $unreadCount = Message::where('receiver_id', Auth::id())
                    ->where('sender_id', $otherUser->id)
                    ->whereNull('read_at')
                    ->count();

                return [
                    'user_id' => $otherUser->id,
                    'fname' => $otherUser->fname,
                    'lname' => $otherUser->lname,
                    'email' => $otherUser->email, // Include email for display
                    'latest_message' => $latestMessage->message_content,
                    'latest_message_time' => $latestMessage->created_at->diffForHumans(),
                    'unread_count' => $unreadCount,
                ];
            })
            ->values(); // Reset keys after map

        return response()->json($conversations);
    }

    /**
     * Display all messages in a specific conversation between the authenticated user and another user.
     */
    public function showConversation(User $otherUser)
    {
        $user = Auth::user();

        // Check if $otherUser is the authenticated user themselves
        if ($user->id === $otherUser->id) {
            return response()->json(['message' => 'Cannot view conversation with self.'], 400);
        }

        $messages = Message::where(function ($query) use ($user, $otherUser) {
            $query->where('sender_id', $user->id)
                ->where('receiver_id', $otherUser->id);
        })->orWhere(function ($query) use ($user, $otherUser) {
            $query->where('sender_id', $otherUser->id)
                ->where('receiver_id', $user->id);
        })
            ->with(['sender:id,fname,lname', 'receiver:id,fname,lname', 'house:id,title,location']) // Eager load sender, receiver, house info
            ->orderBy('created_at', 'asc')
            ->get();

        // Mark messages from the other user as read
        Message::where('receiver_id', $user->id)
            ->where('sender_id', $otherUser->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return response()->json($messages);
    }

    /**
     * Send a new message.
     */
    public function store(Request $request)
    {
        try {
            $request->validate([
                'receiver_id' => ['required', 'exists:users,id'],
                'message_content' => ['required', 'string', 'max:2000'],
                'house_id' => ['nullable', 'exists:houses,id'], // Optional
            ]);
        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        }

        $sender = Auth::user();
        $receiver = User::find($request->receiver_id);

        if (!$receiver) {
            return response()->json(['message' => 'Receiver not found.'], 404);
        }

        // Basic check: prevent sending message to self
        if ($sender->id === $receiver->id) {
            return response()->json(['message' => 'Cannot send message to yourself.'], 400);
        }

        $message = Message::create([
            'sender_id' => $sender->id,
            'receiver_id' => $request->receiver_id,
            'house_id' => $request->house_id,
            'message_content' => $request->message_content,
        ]);

        // Eager load relationships for the response
        $message->load('sender:id,fname,lname', 'receiver:id,fname,lname', 'house:id,title,location');

        return response()->json(['message' => 'Message sent successfully!', 'data' => $message], 201);
    }

    /**
     * Mark a specific message as read.
     * This could be used if you want more granular control, e.g., single message read receipt.
     * The `showConversation` method already marks all in a conversation as read.
     */
    public function markAsRead(Message $message)
    {
        $user = Auth::user();

        // Ensure the authenticated user is the receiver of the message and it's not already read
        if ($message->receiver_id !== $user->id || $message->read_at !== null) {
            return response()->json(['message' => 'Unauthorized or message already read.'], 403);
        }

        $message->read_at = now();
        $message->save();

        return response()->json(['message' => 'Message marked as read.']);
    }

    // You might also consider a deleteMessage method, but typically messages are kept for history.
}
