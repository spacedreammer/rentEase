<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    
    public function run(): void
    {
        User::create([
            'fname' => 'space',
            'lname' => 'User',
            'email' => 'admin@space.com',
            'password' => bcrypt('qwertyui'), 
            'role' => 'admin',
        ]);
    }
}
