'use client';

import { useState } from "react";

const BookEvent = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setTimeout(() => {
            setSubmitted(true);
        }, 1000)
    }

    return (
        <div id="book-event">
            {
                submitted ? (
                    <p className="text-sm">Thank you for your signing up</p>
                ): (
                    <div>
                        <form  onSubmit={handleSubmit}>
                            <label htmlFor="email" className="block text-sm font-medium mb-1">Email Address</label>
                            <input 
                                type="email" 
                                id="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email address"
                            />
                        </form>
                        <button type="submit" className="button-submit">Submit</button>
                    </div>
                )
            }
        </div>
    )
}

export default BookEvent