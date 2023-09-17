if __name__ != "__main__":
    import random
    import string

    class Random():
        password_allowed_characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_-0123456789!@#$%^&"

        @staticmethod
        def password(length=12):
            return ''.join(random.choice(Random.password_allowed_characters) for _ in range(length))
