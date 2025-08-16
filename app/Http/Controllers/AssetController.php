<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\Response;

class AssetController extends Controller
{
    /**
     * Serve a private asset file with proper headers
     */
    public function serve(Request $request, string $filename): Response
    {
        // Validate the filename to prevent directory traversal
        if (!preg_match('/^[a-zA-Z0-9._-]+$/', $filename)) {
            abort(404);
        }

        // Check if file exists in private storage
        if (!Storage::disk('local')->exists($filename)) {
            abort(404);
        }

        // Get file contents
        $contents = Storage::disk('local')->get($filename);
        
        // Determine MIME type based on file extension
        $extension = pathinfo($filename, PATHINFO_EXTENSION);
        $mimeType = match ($extension) {
            'riv' => 'application/octet-stream',
            'json' => 'application/json',
            'png' => 'image/png',
            'jpg', 'jpeg' => 'image/jpeg',
            'gif' => 'image/gif',
            'svg' => 'image/svg+xml',
            'css' => 'text/css',
            'js' => 'application/javascript',
            default => 'application/octet-stream',
        };

        // Return response with proper headers
        return response($contents, 200, [
            'Content-Type' => $mimeType,
            'Content-Length' => Storage::disk('local')->size($filename),
            'Cache-Control' => 'public, max-age=31536000', // Cache for 1 year
        ]);
    }
} 