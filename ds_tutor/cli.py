import json
import sys
import typer

from app.schemas import QueryRequest
from app.services.tutor import TutorService

app = typer.Typer(add_completion=False, no_args_is_help=True)


@app.command()
def ask(
	question: str = typer.Argument(..., help="Your question"),
	intent: str = typer.Option(None, help="qa|resources|code|explain"),
	topic: str = typer.Option(None, help="Optional topic focus, e.g. pandas"),
	level: str = typer.Option("beginner", help="beginner|intermediate|advanced"),
	framework: str = typer.Option(None, help="Optional framework preference"),
):
	service = TutorService()
	req = QueryRequest(question=question, intent=intent, topic=topic, level=level, framework=framework)
	resp = service.handle_query(req)
	typer.echo(json.dumps(resp.model_dump(), indent=2))


if __name__ == "__main__":
	app()