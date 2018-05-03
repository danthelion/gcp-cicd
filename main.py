def increment_number_by_one(x: int) -> int:
    return x + 1


def test_increment_number_by_one() -> None:
    assert increment_number_by_one(3) == 4
