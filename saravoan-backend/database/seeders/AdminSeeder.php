<?php
// database/seeders/AdminSeeder.php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        // Create default admin — change email/password after first login!
        User::firstOrCreate(
            ['email' => 'admin@saravoan.com'],
            [
                'name'     => 'Admin',
                'email'    => 'admin@saravoan.com',
                'password' => Hash::make('Admin@1234'),
                'role'     => 'admin',
            ]
        );

        $this->command->info('✓ Admin account created:');
        $this->command->info('  Email:    admin@saravoan.com');
        $this->command->info('  Password: Admin@1234');
        $this->command->info('  Please change the password after first login!');
    }
}
