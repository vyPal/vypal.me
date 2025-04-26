<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;

class CreateAdminUser extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'admin:create';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a new admin user with prompts for information';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Creating a new admin user...');

        // Prompt for user details
        $name = $this->askValid(
            'What is the admin name?',
            'name',
            ['required', 'string', 'max:255']
        );

        $email = $this->askValid(
            'What is the admin email?',
            'email',
            ['required', 'string', 'email', 'max:255', 'unique:users']
        );

        $password = $this->askValid(
            'What is the admin password?',
            'password',
            ['required', 'string', Password::defaults()],
            true
        );

        // Confirm the password
        $password_confirmation = $this->secret('Confirm the admin password:');

        if ($password !== $password_confirmation) {
            $this->error('Passwords do not match!');
            return 1;
        }

        // Create the admin user
        try {
            $user = User::create([
                'name' => $name,
                'email' => $email,
                'password' => Hash::make($password),
                'is_admin' => true, // Assuming you have an is_admin column
            ]);

            $this->info("✓ Admin user '{$user->name}' created successfully!");
            $this->newLine();
            $this->table(
                ['ID', 'Name', 'Email', 'Admin Status'],
                [[$user->id, $user->name, $user->email, 'Admin']]
            );

            return 0;
        } catch (\Exception $e) {
            $this->error("Failed to create admin user: {$e->getMessage()}");
            return 1;
        }
    }

    /**
     * Ask a question and validate the answer.
     *
     * @param string $question
     * @param string $field
     * @param array $rules
     * @param bool $secret
     * @return string
     */
    protected function askValid($question, $field, $rules, $secret = false)
    {
        $value = $secret ? $this->secret($question) : $this->ask($question);

        $validator = Validator::make(
            [$field => $value],
            [$field => $rules]
        );

        if ($validator->fails()) {
            $this->error($validator->errors()->first($field));
            return $this->askValid($question, $field, $rules, $secret);
        }

        return $value;
    }
}
