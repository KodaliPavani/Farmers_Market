import psycopg2
import sys

def test_local_passwords():
    passwords = ["PaMi@9502347705", "PaMi@950234770547705", "postgres", "password"]
    for p in passwords:
        try:
            print(f"Testing local PG with password: {p}...")
            conn = psycopg2.connect(
                host="localhost",
                port=5432,
                database="postgres",
                user="postgres",
                password=p
            )
            cursor = conn.cursor()
            cursor.execute("SELECT table_schema, table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;")
            rows = cursor.fetchall()
            print(f"SUCCESS! Local PG authenticated with password: {p}")
            print("LOCAL TABLES:")
            for r in rows:
                print(f"- {r[0]}.{r[1]}")
            cursor.close()
            conn.close()
            return p
        except Exception as e:
            print(f"Failed with password {p}: {e}")
    return None

if __name__ == "__main__":
    test_local_passwords()
